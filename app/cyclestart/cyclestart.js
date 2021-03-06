angular.module('cyclestart', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cyclestart', {
            templateUrl: 'cyclestart/cyclestart.html',
            controller: 'CyclestartCtrl'
        });
    }])

    .controller('CyclestartCtrl', function ($scope, $http, $location, $window, $rootScope, $timeout, $interval, $filter) {

        $scope.MachineID;
        $scope.ShiftID;
        $scope.from_date;
        console.log($scope.tenant_id)
        //$scope.tenant_id = localStorage.getItem("tenant_id");

        $scope.imageshow=1;

        $scope.momentToday = moment(new Date()).format("YYYY-MM-DD");
        $scope.momentToday1 = moment().subtract(1, 'day').format("YYYY-MM-DD");
        $http({
            method: 'GET',
            url: $rootScope.api_url + 'api/v1/machines?tenant_id=' + $scope.tenant_id
        })
            .then(function (response) {
                $rootScope.allmachines = response.data;
            })


        $http({
            method: 'GET',
            url: $rootScope.api_url + 'api/v1/shifts?tenant_id=' + $scope.tenant_id
        })
            .then(function (response) {
                $scope.shiftdetailfordrop = response.data;

                $http({
                    method: 'GET',
                    url: $rootScope.api_url + 'api/v1/shifttransactions?shift_id=' + $scope.shiftdetailfordrop.id
                })
                    .then(function (response) {
                        $rootScope.shiftstransfordrop = response.data;

                    })
            })

         
        //G
    
         $http({
    method: 'GET',
    url: $rootScope.api_url + 'api/v1/current_shift?tenant_id=' + $scope.tenant_id
})
    .then(function (response) {
        $scope.current_view_details = response.data;
        $scope.MachineID=$scope.current_view_details.machine;
        $scope.ShiftID=$scope.current_view_details.shift_id;
        $scope.from_date=$scope.current_view_details.date;
        $scope.tenant_id=$scope.current_view_details.tenant;
        $scope.start();
    })

 
        $scope.start = function () {
            $scope.myLoader = true;
             $scope.viewDate=  moment($scope.from_date).format("DD-MM-YYYY");
             console.log($scope.viewDate)
            for(var i in $rootScope.allmachines){
                if($rootScope.allmachines[i].id == $scope.MachineID){
                 $scope.machineName=$rootScope.allmachines[i].machine_name;
                 console.log($scope.machineName)
                }

            }

            for(var j in  $rootScope.shiftstransfordrop){
            if($rootScope.shiftstransfordrop[j].id ==  $scope.ShiftID){
              $scope.shiftNo=$rootScope.shiftstransfordrop[j].shift_no; 
              console.log($scope.shiftNo)   
            }
            }
            $scope.imageshow=2;

            $http({
                method: 'GET',
                url: $rootScope.api_url + 'api/v1/cycle_start_to_start?machine_id=' + $scope.MachineID + '&shift_id=' + $scope.ShiftID + '&tenant_id=' + $scope.tenant_id + '&date=' + $scope.from_date
            })
                .then(function (response) {
                    $scope.myLoader = false;
                    $scope.starttostart = response.data;

                    $scope.timestart=[];
                    $scope.countstart=[];
                    for (var data in $scope.starttostart) {
                    var run = parseFloat(secondsToMinutes($scope.starttostart[data]));
                    var count = data*1 + 1;
                    $scope.countstart.push(count);
                    $scope.timestart.push(run);
                    }

                    Highcharts.chart('starttostart', {
                        chart: {
                            type: 'bar',
                            height: '45%'
                        },
                      
                        title: {
                            text: 'Cycle Start to Cycle Start(Mins)'
                        },
                          subtitle: {
                            text: 'Machine ID : '+$scope.machineName +', Shift : '+ $scope.shiftNo+', Date : '+$scope.viewDate,
                            style: {
                                color: "#f58632",
                                fontSize: "16px"
                            }
                        },
                        xAxis: {
                            categories: $scope.countstart.reverse(),
                            title: {
                                text: 'Parts Count'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Time(Min)'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    // color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                },
                                formatter: function () {
                                  
                                   
                                    return this.total + 'min' ;
                                }
                            }

                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal',
                                dataLabels: {
                                   // enabled: true,
                                    //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                   // format: '{point.y:.0f} %', // your label's value plus the percentage sign
                                    valueDecimals: 2 // show your label's value up to two decimal places
                                }
                            }

                        },
                        colors: ['#2cbe63'],
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: 'Time',
                            data:  $scope.timestart.reverse()
                        }]
                    })

                })

        }




        //start Endddd
    });
