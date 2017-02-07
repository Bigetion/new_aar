(function () {
  'use strict';
  App.controller('MainCtrl', ['$scope', 'QueryService', 'Notification', 'ExportDownload', 'Pdf', '$localStorage','Converter',
    function ($scope, QueryService, Notification, ExportDownload, Pdf, $localStorage,Converter) {

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
        var options = options || {
          scale: 1
        };

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

        PDFJS.workerSrc = 'scripts/root/factories/pdfjs/build/pdf.worker.js';
        PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);
      }

      $scope.print = function () {
        var exportedData = [{
          colGroups: [
            [{
              text: "Hello World",
              colClass: "h1"
            }]
          ]
        }];

        ExportDownload.pdfByteBase64(exportedData, "print", "filename").then(function (response) {
          var pdfData = Converter.base64ToByteArray(response);
          $localStorage.pdfPrintData = pdfData;
          window.open("viewer.html");
        })

        // PDFJS.workerSrc = 'scripts/root/factories/pdfjs/build/pdf.worker.js';
        // PDFJS.disableWorker = true;

        // PDFJS.getDocument({data: pdfData}).then(function (pdf) {
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

        // PDFJS.getDocument({ data: pdfData }).then(function getPdfHelloWorld(pdf) {
        //   // Fetch the first page.
        //   pdf.getPage(1).then(function getPageHelloWorld(page) {
        //     var scale = 1.5;
        //     var viewport = page.getViewport(scale);
        //     var canvas = document.getElementById('myCanvas');
        //     var context = canvas.getContext('2d');
        //     canvas.height = viewport.height;
        //     canvas.width = viewport.width;
        //     var renderContext = {
        //       canvasContext: context,
        //       viewport: viewport
        //     };
        //     page.render(renderContext);
        //   });
        // });
      }

    }]);
})()