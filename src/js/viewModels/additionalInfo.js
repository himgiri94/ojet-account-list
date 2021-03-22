define(
    ['accUtils',
        'knockout',
        'ojs/ojmodel',
        'ojs/ojcollectiondataprovider',
        'appController',
        'ojs/ojmodule-element-utils',
        'ojs/ojarraydataprovider',
        "ojs/ojlistdataproviderview",
        "ojs/ojanimation",
        "jquery",
        "ojs/ojasyncvalidator-regexp",
        "ojs/ojbutton",
        "ojs/ojpopup",
        "ojs/ojradioset",
        "ojs/ojselectsingle",
        "ojs/ojformlayout",
        "ojs/ojcheckboxset",
        "ojs/ojinputnumber",
        "ojs/ojswitch",
        "ojs/ojprogress-bar"
    ]
    , function (accUtils, ko, Model, CollectionDataProvider, app, moduleUtils,
        ArrayDataProvider, ListDataProviderView, AnimationUtils, $, AsyncRegExpValidator, subHeader) {
        function additionalInfoViewModel(params) {
            $(".oj-web-applayout-footer").hide();
            $(".oj-hybrid-applayout-navbar-app").hide();
            var self = this;
            self.router = params.parentRouter;
            self.args = params.params.DATA;
            self.addAccountHeaderConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/addAccountHeader.html' }).then(function (view) {
                self.addAccountHeaderConfig({ 'view': view, 'viewModel': app.getAddAccountHeaderModel(self.router) })
            })
            self.selectedSegment = ko.observable();
            self.selectedpSegment = ko.observable();

            this.segmentSource = new ArrayDataProvider(segmentList, {
                keyAttributes: "value",
            });

            self.selectedsSegment = ko.observable();

            this.pSegmentSource = new ArrayDataProvider(pSegmentList, {
                keyAttributes: "value",
            });

            self.selectedsSegment = ko.observable();

            this.sSegmentSource = new ArrayDataProvider(sSegmentList, {
                keyAttributes: "value",
            });

            self.goBack = function () {
                self.router.go({ path: 'contactDetails', params: {} })
            }
            self.saveAccount = function () {
                let tSegment = document.getElementById("segment");
                let pSegment = document.getElementById("pSegment");
                let sSegment = document.getElementById("sSegment");

                tSegment.validate().then((res1) => {
                    pSegment.validate().then((res2) => {
                        sSegment.validate().then((res3) => {
                            if (res1 == "valid" && res2 == "valid" && res3 == "valid") {
                                // save to local storage
                                let obj = {
                                    "ADDITIONALINFO": {
                                        "SEGMENT": self.selectedSegment(),
                                        "PSEGEMENT": self.selectedpSegment(),
                                        "SSEGMENT": self.selectedsSegment()
                                    }
                                }
                                let json1 = JSON.parse(self.args)
                                let finalObj = {
                                    ...json1,
                                    ...obj
                                }
                                localStorage.setItem("ACCOUNTDET", JSON.stringify(finalObj));
                                console.log(finalObj)
                                self.router.go({ path: 'dashboard', params: {} })
                            }

                        })

                    })

                })
            }
        }
        return additionalInfoViewModel;
    });