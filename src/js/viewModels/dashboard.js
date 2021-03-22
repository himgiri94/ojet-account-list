/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
        'accUtils',
        'knockout',
        'ojs/ojmodel',
        'ojs/ojcollectiondataprovider',
        'appController',
        'ojs/ojmodule-element-utils',
        'ojs/ojarraydataprovider',
        "ojs/ojlistdataproviderview",
        "ojs/ojanimation",
        "show-account-details/loader",
        'ojs/ojlabel',
        "ojs/ojtable", "ojs/ojinputtext",
        'ojs/ojlistview',
        'ojs/ojavatar',
        "ojs/ojpopup",
        "ojs/ojradioset",
        "ojs/ojbutton"
    ],
    function(accUtils, ko, Model, CollectionDataProvider, app, moduleUtils, ArrayDataProvider, ListDataProviderView, AnimationUtils) {

        function DashboardViewModel(params) {
            var self = this;
            var popup = '';
            var accountListUrl = 'http://demo6785834.mockable.io/accounts';
            self.accountListProvider = ko.observable();
            self.currentStatus = ko.observable("All");
            self.handleValueChanged = () => {
                this.filter(document.getElementById("filter").rawValue);
            };
            self.filter = ko.observable();

            // Header Config
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            self.filterValue = ko.observable()
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function(view) {
                self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() })
            })
            self.length = ko.observable(0);
            var ctr = 0;

            self.router = params.parentRouter;

            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            function parseItem(response) {
                var LastVisitVal = response.LastVisit;
                let months = {
                    "1": "Jan",
                    "2": "Feb",
                    "3": "March",
                    "4": "Apr",
                    "5": "May",
                    "6": "June",
                    "7": "July",
                    "8": "Aug",
                    "9": "Sept",
                    "10": "Oct",
                    "11": "Nov",
                    "12": "Dec"
                };
                let lday, lmonth, lyear;
                let nday, nmonth, nyear;
                if (LastVisitVal == null) {
                    LastVisitVal = 'NA';
                } else {
                    LastVisitVal = new Date(LastVisitVal);
                    lday = LastVisitVal.getDate();
                    lmonth = months[LastVisitVal.getMonth() + 1];
                    lyear = LastVisitVal.getFullYear();
                }
                var NextVisitVal = response.NextVisit;
                if (NextVisitVal == null) {
                    NextVisitVal = 'NA';
                } else {
                    nday = LastVisitVal.getDate();
                    nmonth = months[LastVisitVal.getMonth() + 1];
                    nyear = LastVisitVal.getFullYear();
                }
                var accountName = response.OrganizationName == null ? "NA" : response.OrganizationName;
                ctr++;
                self.length(ctr);
                return {
                    name: accountName,
                    lday: lday,
                    lmonth: lmonth,
                    lyear: lyear,
                    nday: nday,
                    nmonth: nmonth,
                    nyear: nyear,
                    LastVisit: LastVisitVal,
                    NextVisit: NextVisitVal,
                    orgStatus: response.OrganizationDEO_Status_c,
                    status: response.SalesProfileStatus
                }
            }

            //Single line of data
            var accountListModel = Model.Model.extend({
                urlRoot: accountListUrl,
                parse: parseItem,
                idAttribute: 'id'
            });

            //Multiple models i.e. multiple lines of data
            self.myAccountList = new accountListModel();
            var accountListCollection = new Model.Collection.extend({
                url: accountListUrl,
                model: self.myAccountList,
                comparator: 'id'
            });

            /*
             *An observable called accountListProvider is already bound in the View file
             *from the JSON example, so you don't need to update dashboard.html
             */
            self.myAccountListCol = new accountListCollection();
            self.accountListProvider(new CollectionDataProvider(self.myAccountListCol));


            // add new account navigation
            self.addAccounts = function() {
                self.router.go({ path: 'basicInfo', params: {} });
            }

            self.showAccountDetails = function(accountName, lmonth, lday, lyear, nmonth, nday, nyear, accountStatus, orgStatus) {
                let LastVisit, NextVisit = "";
                if (lday === undefined) {
                    LastVisit = "NA";
                } else {
                    LastVisit = lday + "-" + lmonth + "-" + lyear;
                }
                if (nday === undefined) {
                    NextVisit = "NA";
                } else {
                    NextVisit = nday + "-" + nmonth + "-" + nyear;
                }

                self.router.go({
                    path: 'showAccountDetails',
                    params: {
                        "accountName": accountName,
                        "LastVisit": LastVisit,
                        "NextVisit": NextVisit,
                        "accountStatus": accountStatus,
                        "orgStatus": orgStatus
                    }
                });
            }

            this.handleValueChanged = (event) => {
                if (event.detail.value === null || event.detail.value === undefined || event.detail.value === "") {
                    this.accountListProvider(new CollectionDataProvider(this.myAccountListCol));
                };
                if (this.filteredCollection === undefined) {
                    this.filteredCollection = this.myAccountListCol.clone();
                    this.filteredDataProvider = new CollectionDataProvider(this.filteredCollection);
                }
                var ret = this.myAccountListCol.where({
                    name: {
                        value: event.detail.value,
                        comparator: (model, attr, value) => {
                            let name = model.get("name");
                            return name.toLowerCase().includes(value.toLowerCase());
                        },
                    },
                });

                this.filteredCollection.reset(ret);
                self.length(this.filteredCollection.length);
                this.accountListProvider(this.filteredDataProvider);
            };

            // pop-up option and animation

            self.startAnimationListener = (event) => {
                let ui = event.detail;
                if (event.target.id !== "filterPopup") {
                    return;
                }
                if (ui.action === "open") {
                    event.preventDefault();
                    let options = { direction: "top" };
                    AnimationUtils.slideIn(ui.element, options).then(ui.endCallback);
                } else if (ui.action === "close") {
                    event.preventDefault();
                    ui.endCallback();
                }
            };

            self.openListener = function() {
                popup = document.getElementById("filterPopup");
                popup.open("#btnGo");
            }
            self.clearFilters = function() {
                self.currentStatus("All");
                $("#filterStatus").removeClass("oj-sm-show").addClass("oj-sm-hide");
                popup.close();
                self.accountListProvider(new CollectionDataProvider(self.myAccountListCol));

            }

            self.closeFilter = function() {
                popup.close();
            }

            self.applyFilters = function() {
                if (this.filteredCollection === undefined) {
                    this.filteredCollection = self.myAccountListCol.clone();
                    this.filteredDataProvider = new CollectionDataProvider(this.filteredCollection);
                }

                if (self.currentStatus() == "All") {
                    self.accountListProvider(new CollectionDataProvider(self.myAccountListCol));
                    popup.close();
                    return;
                }
                var ret = self.myAccountListCol.where({
                    status: {
                        value: self.currentStatus(),
                        comparator: (model, attr, value) => {
                            let name = model.get("status");
                            return name.toLowerCase().includes(value.toLowerCase());
                        },
                    },
                });

                this.filteredCollection.reset(ret);
                self.length(this.filteredCollection.length);
                self.accountListProvider(this.filteredDataProvider);

                popup.close();
                $("#filterStatus").removeClass("oj-sm-hide").addClass("oj-sm-show");
            }

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = function() {
                accUtils.announce('Dashboard page loaded.');
                document.title = "Dashboard";
                // Implement further logic if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function() {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function() {
                // Implement if needed
            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return DashboardViewModel;
    }
);