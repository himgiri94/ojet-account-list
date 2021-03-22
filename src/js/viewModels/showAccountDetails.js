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
        'show-account-details/loader',
        "ojs/ojbutton"
    ],
    /*function(acct,ko, app, moduleUtils, accUtils,Model,ArrayDataProvider,
     CollectionDataProvider,ListDataProviderView) {*/
    function(accUtils, ko, Model, CollectionDataProvider, app, moduleUtils) {
        function showAccountDetails(args) {
            $(".oj-web-applayout-footer").hide();
            $(".oj-hybrid-applayout-navbar-app").hide();
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            // self.accountName = ko.observable('ewt');
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function(view) {
                self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() })
            });

            self.router = args.parentRouter;
            self.accountData = args.params;
            self.accountName = self.accountData.accountName;
            self.status = self.accountData.accountStatus;
            self.lastVisit = self.accountData.LastVisit;
            self.nextVisit = self.accountData.NextVisit;
            self.orgStatus = self.accountData.orgStatus;


            self.gotoDashboard = function() {
                self.router.go({ path: 'dashboard', params: {} })
            }
        }
        return showAccountDetails;
    });