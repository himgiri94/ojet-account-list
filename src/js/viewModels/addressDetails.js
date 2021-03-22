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
        "ojs/ojbutton",
        "ojs/ojformlayout",
        "ojs/ojcheckboxset",
        "ojs/ojinputnumber",
        "ojs/ojprogress-circle"
    ]
    , function (accUtils, ko, Model, CollectionDataProvider, app, moduleUtils,
        ArrayDataProvider, ListDataProviderView, AnimationUtils, $, AsyncRegExpValidator) {
        function addressDetailsViewModel(params) {
            $(".oj-web-applayout-footer").hide();
            $(".oj-hybrid-applayout-navbar-app").hide();
            var self = this;
            self.router = params.parentRouter;
            self.args = params.params;


            self.addAccountHeaderConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/addAccountHeader.html' }).then(function (view) {
                self.addAccountHeaderConfig({ 'view': view, 'viewModel': app.getAddAccountHeaderModel(self.router) })
            })

            self.addr1 = ko.observable();
            self.addr2 = ko.observable();
            self.pcode = ko.observable(000000);
            self.lat = ko.observable();
            self.lang = ko.observable();
            self.loadingVal = ko.observable(0);
            self.addr1Validator = [
                new AsyncRegExpValidator({
                    pattern: "^([a-zA-z0-9 /\\''(),-\s]{2,255})$",
                    hint: "Enter a  address",
                    messageDetail: "Enter at  3 least  characters and supported special char are ,-\()",
                }),
            ];

            self.addr2Validator = [
                new AsyncRegExpValidator({
                    pattern: "^([a-zA-z0-9 /\\''(),-\s]{2,255})$",
                    hint: "Enter a  address",
                    messageDetail: "Enter at  3 least  characters and supported special char are ,-\()",
                }),
            ];

            self.pcodeValidator = [
                new AsyncRegExpValidator({
                    pattern: "[0-9]{6}$",
                    hint: "Enter a  pincode",
                    messageDetail: "Enter a valid 6 digit code",
                }),
            ];

            self.selectedCountry = ko.observable();

            this.countryListSource = new ArrayDataProvider(countryList, {
                keyAttributes: "value",
            });

            self.selectedState = ko.observable();

            this.stateListSource = new ArrayDataProvider(stateList, {
                keyAttributes: "value",
            });

            //Latitude and longitude handlers
            self.selectedLatitudeDir = ko.observable("N");
            self.selectedLongitudeDir = ko.observable("N");


            this.latDirListSource = new ArrayDataProvider(latList, {
                keyAttributes: "value",
            });


            this.langDirListSource = new ArrayDataProvider(langList, {
                keyAttributes: "value",
            });

            self.currentAddrType = ko.observable("General");


            self.loadingVal.subscribe((newValue) => {
                if (newValue === 100) {
                    self.loadingVal(0);
                }
            });

            self.getCurrentPos = function () {
                $("#gpsLoading").show();
                window.setInterval(() => {
                    {
                        self.loadingVal(Math.min(self.loadingVal() + 1
                            , 100));
                    }
                }, 10);
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        self.lat(pos.coords.latitude);
                        self.lang(pos.coords.longitude);
                        $("#gpsLoading").hide();
                    },
                    function (err) { console.log("Unable to fetch loc") });
            }
            self.gotoContactDetails = function () {
                let ele1 = document.getElementById("addr1");
                let ele2 = document.getElementById("addr2");
                let ele3 = document.getElementById("pcode");
                let ele4 = document.getElementById("lat");
                let ele5 = document.getElementById("lang");
                let ele6 = document.getElementById("country");
                let ele7 = document.getElementById("state");
                let test = "valid";
                ele1.validate().then((res1) => {
                    ele2.validate().then((res2) => {
                        ele3.validate().then((res3) => {
                            ele4.validate().then((res4) => {
                                ele5.validate().then((res5) => {
                                    ele6.validate().then((res6) => {
                                        ele7.validate().then((res7) => {
                                            if (res1 != "valid") {
                                                ele1.focus();
                                                return false;
                                            }
                                            if (res2 != "valid") {
                                                ele2.focus();
                                                return false;
                                            }
                                            if (res4 != "valid") {
                                                ele3.focus();
                                            }
                                            if (res1 == test && res2 == test && res3 == test && res4 == test && res5 == test && res6 == test && res7 == test) {

                                                //LONGITUDE AND LATITUDE VLAIDATION
                                                if (isFinite(self.lang()) && Math.abs(self.lang()) <= 180) {
                                                    if (isFinite(self.lat()) && Math.abs(self.lat()) <= 90) {
                                                        let obj = {
                                                            "BASICDET": self.args,
                                                            "PRIMARYCONTACT": {
                                                                "ADDR1": self.addr1(),
                                                                "ADDR2": self.addr2(),
                                                                "COUNTRY": self.selectedCountry(),
                                                                "STATE": self.selectedState(),
                                                                "PCODE": self.pcode(),
                                                                "LATITUDE": self.lat() + " " + self.selectedLatitudeDir(),
                                                                "LONGITUDE": self.lang() + " " + self.selectedLongitudeDir(),

                                                                "CLASS": self.currentAddrType()
                                                            }
                                                        }
                                                        var strObj = JSON.stringify(obj);
                                                        self.router.go({ path: 'contactDetails', params: { "DATA": strObj } });
                                                    }
                                                }

                                            }
                                        })
                                    })
                                })
                            })
                        });
                    });
                });
            }
            self.goBack = function () {
                self.router.go({
                    path: 'basicInfo', params: {

                    }
                })
            }
        }
        return addressDetailsViewModel;
    });