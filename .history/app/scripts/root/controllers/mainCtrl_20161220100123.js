(function () {
  'use strict';
  App.controller('MainCtrl', ['$scope', 'QueryService', 'Notification', 'ExportDownload', 'Pdf',
    function ($scope, QueryService, Notification, ExportDownload, Pdf) {

      $scope.userList = {
        data: [],
        page: 1,
        totalRecord: 0
      }

      QueryService.getByOptions('table=users&page=1&page_limit=10').then(function (response) {
        $scope.userList.page = 1;
        $scope.userList.data = response.data
        $scope.userList.totalRecord = '' + response.total_record
      })

      $scope.userListPageChanged = function () {
        QueryService.getByOptions('table=users&page=' + $scope.userList.page + '&page_limit=10').then(function (response) {
          $scope.userList.data = response.data
        })
      }

      $scope.renderPDF = function (url, canvasContainer, options) {
        var options = options || { scale: 1 };

        function renderPage(page) {
          var viewport = page.getViewport(options.scale);
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvasContainer.appendChild(canvas);

          page.render(renderContext);
        }

        function renderPages(pdfDoc) {
          for (var num = 1; num <= pdfDoc.numPages; num++)
            pdfDoc.getPage(num).then(renderPage);
        }
        PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);
      }

      $scope.renderPDF('sample.pdf',document.getElementById('holder'))

      $scope.print = function () {
        var exportedData = [{
          colGroups: [[{
            text: "Hello World",
            colClass: "h1"
          }]]
        }]
        ExportDowonload.pdfByteArray(exportedData, "print", "filename", "subTitle").then(function (response) {
          var pdfData = atob(response);
          // PDFJS.getDocument(pdfData).then(function (pdf) {
          //   pdf.getPage(1).then(function (page) {
          //     var scale = 1;
          //     var viewport = page.getViewport(scale);
          //     var canvas = document.getElementById('myCanvas');
          //     var context = canvas.getContext('2d');
          //     canvas.height = viewport.height;
          //     canvas.width = viewport.width;
          //     page.render({ canvasContext: context, viewport: viewport });
          //   });
          // });

          // function base64ToUint8Array(base64) {
          //   var raw = atob(base64);
          //   var uint8Array = new Uint8Array(raw.length);
          //   for (var i = 0; i < raw.length; i++) {
          //     uint8Array[i] = raw.charCodeAt(i);
          //   }
          //   return uint8Array;
          // }
          PDFJS.getDocument({ data: pdfData }).then(function getPdfHelloWorld(pdf) {
            // Fetch the first page.
            pdf.getPage(1).then(function getPageHelloWorld(page) {
              var scale = 1.5;
              var viewport = page.getViewport(scale);
              // Prepare canvas using PDF page dimensions.
              var canvas = document.getElementById('myCanvas');
              var context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              // Render PDF page into canvas context.
              var renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext);
            });
          });
        })
      }

    }
  ]);
})()