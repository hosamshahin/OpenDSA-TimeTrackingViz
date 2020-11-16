$(function () {

  Plotly.d3.json("https://raw.githubusercontent.com/hosamshahin/OpenDSA-TimeTrackingViz/master/fake_data.json",
    function (err, userData) {

      var studentsInfo = userData["studentsInfo"]
      var weeksData = userData["weeks"]
      var weeksNames = userData["weeks_names"]
      var weeksDates = userData["weeks_dates"]
      var chaptersData = userData["chapters"]
      var chaptersNames = userData["chapters_names"]
      var chaptersDates = userData["chapters_dates"]
      var numOfWeeks = weeksData.length
      var numOfChapters = chaptersData.length

      var text = studentsInfo.map(x => x.first_name + " " + x.last_name + "<" + x.email + ">")
      var studentsInfoIndex = {};

      for (var i = 0; i < studentsInfo.length; i++) {
        studentsInfoIndex[studentsInfo[i]['email']] = i;
      }

      var plotlyBoxDiv = $("#plotlyBoxDiv")[0]

      var dataTables = null;
      var lineDataTables = null;
      var currentBoxTab = 'weeks';
      var currentLineTab = 'weeks';
      var currentLinePercentile = '25';

      function createDataTables(chosenStudentsInfo, caption, plot) {
        var plot = plot || "box"
        var caption = caption || ""
        var $students_caption = (plot === "box") ? $(".students_caption") : $(".students_caption_line")
        var $students_info = (plot === "box") ? $(".students_info") : $(".students_info_line")

        if ($(".students_caption").length) {
          $(".students_caption").text(caption);
        } else {
          $('#students_info').append('<caption style="caption-side: top" class="students_caption">' + caption + '</caption>');
        }

        return $('#students_info').DataTable({
          destroy: true,
          data: chosenStudentsInfo,
          columns: [
            { title: "Fist Name" },
            { title: "Last Name" },
            { title: "Email" },
            { title: "Reading time" }
          ]
        });
      }

      function clearDataTables(dataTables) {
        if ($(".students_caption").length) {
          $(".students_caption").text("");
        }

        dataTables.rows()
          .remove()
          .draw();
      }

      // plotly data
      var plotlyBoxData = []
      var weeksVisible = []
      var chaptersVisible = []
      // Add weeks
      for (var i = 0; i < weeksData.length; i++) {
        var result = {
          name: weeksNames[i],
          width: 0.5,
          quartilemethod: "inclusive",
          type: 'box',
          y: weeksData[i],
          text: text,
          hoverinfo: "all",
          hovertemplate: "%{text}<br>%{y:.2f} mins<extra></extra>",
          boxpoints: 'all',
          boxmean: "sd",
          jitter: 0.2,
          whiskerwidth: 0.2,
          fillcolor: 'cls',
          marker: {
            outliercolor: 'rgb(255, 0, 0)',
            size: 4,
            symbol: '0',
            opacity: 1
          },
          selectedpoints: [],
          selected: {
            marker: {
              size: 7,
              color: 'rgb(255, 0, 0)'
            }
          },
          line: {
            width: 1
          },
          hoverlabel: {
            font: { size: 15 }
          }
        };
        plotlyBoxData.push(result);
        weeksVisible.push(true)
        chaptersVisible.push(false)
      };

      // Add chapters
      for (var i = 0; i < chaptersData.length; i++) {
        var result = {
          name: chaptersNames[i],
          width: 0.5,
          quartilemethod: "inclusive",
          type: 'box',
          y: chaptersData[i],
          text: text,
          hoverinfo: "all",
          hovertemplate: "%{text}<br>%{y:.2f} mins<extra></extra>",
          boxpoints: 'all',
          boxmean: "sd",
          jitter: 0.2,
          whiskerwidth: 0.2,
          fillcolor: 'cls',
          marker: {
            outliercolor: 'rgb(255, 0, 0)',
            size: 4,
            symbol: '0',
            opacity: 1
          },
          selectedpoints: [],
          selected: {
            marker: {
              size: 6,
              color: 'rgb(255, 0, 0)'
            }
          },
          line: {
            width: 1
          },
          hoverlabel: {
            font: { size: 15 }
          },
          visible: false
        };
        plotlyBoxData.push(result);
        weeksVisible.push(false)
        chaptersVisible.push(true)
      };

      // plotly menu
      var updatemenus = [
        {
          buttons: [
            {
              name: 'weeks',
              args: [{ 'visible': weeksVisible },
              {
                'title': 'Total time students spend on OpenDSA materials per week.'
              }
              ],
              label: 'Weeks',
              method: 'update'
            },
            {
              name: 'chapters',
              args: [{ 'visible': chaptersVisible },
              {
                'title': 'Total time students spend on OpenDSA materials per chapter.'
              }
              ],
              label: 'Chapters',
              method: 'update'
            }
          ],
          direction: 'left',
          pad: { 'r': 10, 't': 10 },
          showactive: true,
          type: 'buttons',
          x: 1,
          xanchor: 'right',
          y: 1.2,
          yanchor: 'top'
        },
        {
          buttons: [
            {
              name: 'reset',
              label: 'Reset',
              method: 'skip',
              execute: false
            },
            {
              name: '25',
              label: '25th percentile',
              method: 'skip',
              execute: false
            },
            {
              name: '50',
              label: '50th percentile',
              method: 'skip',
              execute: false
            }
          ],
          direction: 'left',
          pad: { 'r': 10, 't': 10 },
          showactive: false,
          type: 'buttons',
          x: 0,
          xanchor: 'left',
          y: 1.2,
          yanchor: 'top'
        }
      ]

      // plotly layout
      var plotlyBoxLayout = {
        'title': 'Total time students spend on OpenDSA materials per week.',
        updatemenus: updatemenus,
        yaxis: {
          title: 'Reading time in mins.',
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 5,
          gridcolor: 'rgb(255, 255, 255)',
          gridwidth: 1,
          zerolinecolor: 'rgb(255, 255, 255)',
          zerolinewidth: 2
        },
        margin: {
          l: 40,
          r: 30,
          b: 80,
          t: 100
        },
        paper_bgcolor: 'rgb(243, 243, 243)',
        plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: true,
        legend: {
          x: 1.07,
          xanchor: 'right',
          y: 1
        }
      }

      // plotly initialize
      Plotly.newPlot(plotlyBoxDiv, plotlyBoxData, plotlyBoxLayout)
        .then(() => {
          $("#my-accordion").accordionjs({ closeAble: true });
        })

      // get the index(es) of the active trace(s)
      function getActiveTrace() {
        var calcdata = plotlyBoxDiv.calcdata
        var activeTraces = []
        for (var i = 0; i < calcdata.length; i++) {
          if (calcdata[i][0]['x'] != undefined)
            activeTraces.push(i)
        }
        return activeTraces
      }

      // event handler to select points and show dataTables
      plotlyBoxDiv.on('plotly_buttonclicked', function (e) {
        var buttonName = e.button.name;
        var plotMean = null;
        var plotQ1 = null;
        var traceIndex = null
        var chosenStudents = [];
        var chosenStudentsInfo = [];
        var studentInfo = {};
        selectize.clear()

        if (['weeks', 'chapters'].includes(buttonName)) {
          currentBoxTab = buttonName;
          if (dataTables) {
            clearDataTables(dataTables)
          }
        } else {
          traceIndex = getActiveTrace()[0]

          plotMean = plotlyBoxDiv.calcdata[traceIndex][0]['med'];
          plotQ1 = plotlyBoxDiv.calcdata[traceIndex][0]['q1'];

          var tabIndex = (traceIndex + 1 > numOfWeeks) ? traceIndex - numOfWeeks : traceIndex;
          var refData = userData[currentBoxTab][tabIndex]
          var refName = userData[currentBoxTab + "_names"][tabIndex]
          if (buttonName == '25') {
            for (var i = 0; i < refData.length; i++) {
              if (refData[i] <= plotQ1) {
                chosenStudents.push(i);
                studentInfo = studentsInfo[i]
                chosenStudentsInfo.push([studentInfo['first_name'], studentInfo['last_name'], studentInfo['email'], refData[i]])
              }
            }
            dataTables = createDataTables(chosenStudentsInfo, "Students reading time less than 25th percentile for " + refName)
          } else if (buttonName == '50') {
            for (var i = 0; i < refData.length; i++) {
              if (refData[i] <= plotMean) {
                chosenStudents.push(i);
                studentInfo = studentsInfo[i]
                chosenStudentsInfo.push([studentInfo['first_name'], studentInfo['last_name'], studentInfo['email'], refData[i]])
              }
            }
            dataTables = createDataTables(chosenStudentsInfo, "Students reading time less than 50th percentile for " + refName)
          } else {
            chosenStudents = []
            if (dataTables) {
              clearDataTables(dataTables)
            }
          }

          plotlyBoxData[traceIndex]['selectedpoints'] = chosenStudents
          Plotly.update(plotlyBoxDiv, plotlyBoxData, plotlyBoxLayout);
        }
      })

      function updateBoxPlot(chosenStudents) {
        var chosenStudents = chosenStudents || []
        var traceIndex = getActiveTrace()

        for (var i = 0; i < traceIndex.length; i++) {
          plotlyBoxData[traceIndex[i]]['selectedpoints'] = chosenStudents
        }
        Plotly.update(plotlyBoxDiv, plotlyBoxData, plotlyBoxLayout)
      };

      //
      // selectize code
      //
      var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
        '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

      function formatName(item) {
        return $.trim((item.first_name || '') + ' ' + (item.last_name || ''));
      };

      // initialize selectize for box plot
      var $selectize = $('#select-for-box').selectize({
        plugins: ['remove_button'],
        persist: false,
        maxItems: null,
        valueField: 'email',
        labelField: 'name',
        searchField: ['first_name', 'last_name', 'email'],
        sortField: [
          { field: 'first_name', direction: 'asc' },
          { field: 'last_name', direction: 'asc' }
        ],
        options: studentsInfo,
        render: {
          item: function (item, escape) {
            var name = formatName(item);
            return '<div>' +
              (name ? '<span class="name">' + escape(name) + '</span>' : '') +
              (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
              '</div>';
          },
          option: function (item, escape) {
            var name = formatName(item);
            var label = name || item.email;
            var caption = name ? item.email : null;
            return '<div>' +
              '<span class="label">' + escape(label) + '</span>' +
              (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
              '</div>';
          }
        },
        createFilter: function (input) {
          var regexpA = new RegExp('^' + REGEX_EMAIL + '$', 'i');
          var regexpB = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
          return regexpA.test(input) || regexpB.test(input);
        },
        create: function (input) {
          if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
            return { email: input };
          }
          var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
          if (match) {
            var name = $.trim(match[1]);
            var pos_space = name.indexOf(' ');
            var first_name = name.substring(0, pos_space);
            var last_name = name.substring(pos_space + 1);

            return {
              email: match[2],
              first_name: first_name,
              last_name: last_name
            };
          }
          alert('Invalid email address.');
          return false;
        }
      })

      var selectize = $selectize[0].selectize;

      // show current values in multi input dropdown
      $('select.selectized,input.selectized').each(function () {
        var $input = $(this);

        var update = function (e) {
          var selectedStudents = $input.val();
          if (selectedStudents) {
            var chosenStudents = [];
            for (var i = 0; i < selectedStudents.length; i++) {
              chosenStudents.push(studentsInfoIndex[selectedStudents[i]]);
            }
            updateBoxPlot(chosenStudents)
            if (dataTables) {
              clearDataTables(dataTables)
            }
          }
        }

        $(this).on('change', update);
      });


      // initialize selectize for box plot
      var $selectize_line = $('#select-for-line').selectize({
        plugins: ['remove_button'],
        persist: false,
        maxItems: null,
        valueField: 'email',
        labelField: 'name',
        searchField: ['first_name', 'last_name', 'email'],
        sortField: [
          { field: 'first_name', direction: 'asc' },
          { field: 'last_name', direction: 'asc' }
        ],
        options: studentsInfo,
        render: {
          item: function (item, escape) {
            var name = formatName(item);
            return '<div>' +
              (name ? '<span class="name">' + escape(name) + '</span>' : '') +
              (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
              '</div>';
          },
          option: function (item, escape) {
            var name = formatName(item);
            var label = name || item.email;
            var caption = name ? item.email : null;
            return '<div>' +
              '<span class="label">' + escape(label) + '</span>' +
              (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
              '</div>';
          }
        },
        createFilter: function (input) {
          var regexpA = new RegExp('^' + REGEX_EMAIL + '$', 'i');
          var regexpB = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
          return regexpA.test(input) || regexpB.test(input);
        },
        create: function (input) {
          if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
            return { email: input };
          }
          var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
          if (match) {
            var name = $.trim(match[1]);
            var pos_space = name.indexOf(' ');
            var first_name = name.substring(0, pos_space);
            var last_name = name.substring(pos_space + 1);

            return {
              email: match[2],
              first_name: first_name,
              last_name: last_name
            };
          }
          alert('Invalid email address.');
          return false;
        }
      })

      //
      // Line plot
      //
      var selectize_line = $selectize_line[0].selectize;

      // show current values in multi input dropdown
      $('#line_wrapper select.selectized,#line_wrapper input.selectized').each(function () {
        var $input = $(this);

        var update = function (e) {
          var selectedStudents = $input.val();
          if (selectedStudents) {
            var chosenStudents = [];
            for (var i = 0; i < selectedStudents.length; i++) {
              chosenStudents.push(studentsInfoIndex[selectedStudents[i]]);
            }
            updateLinePlot(chosenStudents)
          }
        }
        $(this).on('change', update);
      });

      function updateLinePlot(chosenStudents) {
        var chosenStudents = chosenStudents || []
        var plotlyLineData = []

        for (var i = 0; i < chosenStudents.length; i++) {
          var studentInfo = studentsInfo[chosenStudents[i]]
          var result = {
            type: "scatter",
            mode: "lines",
            name: studentInfo['first_name'] + " " + studentInfo['last_name'],
            x: (currentLineTab === 'weeks') ? weeksDates : chaptersDates,
            y: (currentLineTab === 'weeks') ? weeksTranspose[chosenStudents[i]] : chaptersTranspose[chosenStudents[i]],
            line: {
              dash: 'solid',
              width: 1
            }
          }
          plotlyLineData.push(result);
        };
        addClassStats(plotlyLineData, currentLineTab)

        var range = (currentLineTab === 'weeks') ?
          [weeksDates[0], weeksDates[weeksDates.length - 1]] :
          [chaptersDates[0], chaptersDates[chaptersDates.length - 1]];
        plotlyLineLayout.xaxis.range = range
        plotlyLineLayout.xaxis.rangeslider.range = range
        plotlyLineLayout.sliders[0].steps = calculateSteps("median", currentLineTab)

        Plotly.react(plotlyLineDiv, plotlyLineData, plotlyLineLayout)
      };

      function stats(arr) {
        var sortedArr = [...arr].sort(Plotly.d3.ascending)
        var q1 = Plotly.d3.quantile(sortedArr, .25)
        var median = Plotly.d3.quantile(sortedArr, .50)
        var q3 = Plotly.d3.quantile(sortedArr, .75)

        return {
          q1: q1,
          median: median,
          q3: q3
        }
      }

      // var arrayColumn = (arr, n) => arr.map(x => x[n]);
      function transpose(m) {
        return m[0].map((x, i) => m.map(x => x[i]))
      }

      var weeksStats = weeksData.map(function (row) { return stats(row) });
      var weeksQ1 = weeksStats.map(function (row) { return row['q1'] });
      var weeksMedian = weeksStats.map(function (row) { return row['median'] });
      var weeksQ3 = weeksStats.map(function (row) { return row['q3'] });

      var chaptersStats = chaptersData.map(function (row) { return stats(row) });
      var chaptersQ1 = chaptersStats.map(function (row) { return row['q1'] });
      var chaptersMedian = chaptersStats.map(function (row) { return row['median'] });
      var chaptersQ3 = chaptersStats.map(function (row) { return row['q3'] });

      var weeksTranspose = transpose(weeksData)
      var chaptersTranspose = transpose(chaptersData)

      function getBelowQuartile(quartile, unit) {
        var belowQuartile = []
        var counts = {};
        var belowQuartileObj = {};
        var data = (unit === 'weeks') ? weeksData : chaptersData;
        var stats = (unit === 'weeks') ? weeksStats : chaptersStats;

        // get all students below quartile
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            if (data[i][j] < stats[i][quartile]) {
              belowQuartile.push(studentsInfo[j]['email'])
            }
          }
        }
        // aggregate
        for (var i = 0; i < belowQuartile.length; i++) {
          var num = belowQuartile[i];
          counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        // reformat
        for (var key in counts) {
          if (counts[key] in belowQuartileObj) {
            belowQuartileObj[counts[key]].push(key)
          } else {
            belowQuartileObj[counts[key]] = [key]
          }
        }
        return belowQuartileObj
      }

      var plotlyLineDiv = $("#plotlyLineDiv")[0]
      var plotlyLineData = []

      var plotlyLineClassStats = {
        weeks: {
          q1: {
            type: "scatter",
            mode: "lines",
            name: "class_q1",
            x: weeksDates,
            y: weeksQ1,
            line: {
              dash: 'dashdot',
              width: 1,
              color: '#17BE00'
            }
          },
          median: {
            type: "scatter",
            mode: "lines",
            name: "class_median",
            x: weeksDates,
            y: weeksMedian,
            line: {
              dash: 'dashdot',
              width: 2,
              color: '#17BECF'
            }
          },
          q3: {
            type: "scatter",
            mode: "lines",
            name: "class_q3",
            x: weeksDates,
            y: weeksQ3,
            line: {
              dash: 'dashdot',
              width: 1,
              color: '#17BE00'
            }
          }
        },
        chapters: {
          q1: {
            type: "scatter",
            mode: "lines",
            name: "class_q1",
            x: chaptersDates,
            y: chaptersQ1,
            line: {
              dash: 'dashdot',
              width: 1,
              color: '#17BE00'
            }
          },
          median: {
            type: "scatter",
            mode: "lines",
            name: "class_median",
            x: chaptersDates,
            y: chaptersMedian,
            line: {
              dash: 'dashdot',
              width: 2,
              color: '#17BECF'
            }
          },
          q3: {
            type: "scatter",
            mode: "lines",
            name: "class_q3",
            x: chaptersDates,
            y: chaptersQ3,
            line: {
              dash: 'dashdot',
              width: 1,
              color: '#17BE00'
            }
          }
        }
      }

      function addClassStats(arr, buttonName) {
        arr.push(plotlyLineClassStats[buttonName]['q3'])
        arr.push(plotlyLineClassStats[buttonName]['median'])
        arr.push(plotlyLineClassStats[buttonName]['q1'])
      }

      addClassStats(plotlyLineData, 'weeks')

      var belowQuartileObj = {}
      belowQuartileObj['weeks'] = getBelowQuartile('median', 'weeks')
      belowQuartileObj['chapters'] = getBelowQuartile('median', 'chapters')

      function calculateSteps(quartile, unit) {
        var belowQuartileSteps = Object.keys(belowQuartileObj[unit]).map(function (x) { return parseInt(x, 10) })
        belowQuartileSteps.sort(Plotly.d3.descending)

        // calculate steps
        var steps = []
        steps.push({
          label: parseInt(belowQuartileSteps[0]) + 1,
          method: 'skip',
          execute: false
        })

        for (var i = 0; i < belowQuartileSteps.length; i++) {
          var step = {
            label: belowQuartileSteps[i],
            method: 'skip',
            execute: false
          }
          steps.push(step)
        }
        return steps
      }

      var updatemenusLine = [
        {
          buttons: [
            {
              name: 'weeks',
              args: [{ 'title': 'Total Reading time per week.' }],
              label: 'Weeks',
              method: 'update'
            },
            {
              name: 'chapters',
              args: [{ 'title': 'Total Reading time per chapter.' }],
              label: 'Chapters',
              method: 'update'
            }
          ],
          direction: 'left',
          pad: { 'r': 10, 't': 10 },
          showactive: true,
          type: 'buttons',
          x: 1,
          xanchor: 'right',
          y: 1.3,
          yanchor: 'top'
        },
        // {
        //   buttons: [
        //     {
        //       name: 'reset',
        //       label: 'Reset',
        //       method: 'skip',
        //       execute: false
        //     },
        //     {
        //       name: '25',
        //       label: '25th percentile',
        //       method: 'skip',
        //       execute: false
        //     },
        //     {
        //       name: '50',
        //       label: '50th percentile',
        //       method: 'skip',
        //       execute: false
        //     }
        //   ],
        //   direction: 'left',
        //   pad: { 'r': 10, 't': 10 },
        //   showactive: false,
        //   type: 'buttons',
        //   x: 0.05,
        //   xanchor: 'left',
        //   y: 1.2,
        //   yanchor: 'top'
        // }
      ]

      var plotlyLineLayout = {
        title: "OpenDSA Total Reading Time.",
        updatemenus: updatemenusLine,
        xaxis: {
          autorange: true,
          range: [weeksDates[0], weeksDates[weeksDates.length - 1]],
          rangeselector: {
            buttons: [
              { step: "all" }
            ]
          },
          rangeslider: { range: [weeksDates[0], weeksDates[weeksDates.length - 1]] },
          type: "date"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        },
        sliders: [{
          pad: { t: 85 },
          currentvalue: {
            xanchor: "left",
            prefix: "Students with (",
            suffix: ") week(s) below class median.",
            font: {
              color: "#888",
              size: 20
            }
          },
          steps: calculateSteps("median", 'weeks')
        }],
        showlegend: true,
        legend: {
          x: 1.17,
          xanchor: 'right',
          y: 1
        }
      };

      Plotly.newPlot(plotlyLineDiv, plotlyLineData, plotlyLineLayout)
        .then(() => {
          $("#my-accordion").accordionjs({ closeAble: true });
        })

      plotlyLineDiv.on('plotly_sliderchange', function (e) {
        selectize_line.clear()
        var stepLabel = e.step.label
        var chosenStudents = [];
        var selectedStudents = (Object.keys(belowQuartileObj[currentLineTab]).includes(stepLabel)) ?
          belowQuartileObj[currentLineTab][stepLabel] : [];
        if (selectedStudents) {
          for (var i = 0; i < selectedStudents.length; i++) {
            chosenStudents.push(studentsInfoIndex[selectedStudents[i]]);
          }
        }

        plotlyLineLayout.sliders[0].currentvalue.suffix = (currentLineTab === 'weeks') ? ") week(s) below class median." : ") chapter(s) below class median."
        updateLinePlot(chosenStudents)
      })

      // event handler to select points and show dataTables
      plotlyLineDiv.on('plotly_buttonclicked', function (e) {
        selectize_line.clear()
        var buttonName = e.button.name;

        if (['weeks', 'chapters'].includes(buttonName)) {
          currentLineTab = buttonName;
          plotlyLineLayout.sliders[0].active = 0
          plotlyLineLayout.sliders[0].currentvalue.suffix = (currentLineTab === 'weeks') ? ") week(s) below class median." : ") chapter(s) below class median.";
          updateLinePlot()
        }
      })

    })

})
