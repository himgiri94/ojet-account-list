
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
        'ojs/ojlabel',
        "ojs/ojtable", "ojs/ojinputtext",
        'ojs/ojlistview',
        'ojs/ojavatar',
        "ojs/ojbutton",
        "ojs/ojpopup",
        "ojs/ojradioset",
        "ojs/ojselectsingle",
        "ojs/ojbutton",
        "ojs/ojformlayout",
        "ojs/ojcheckboxset"
    ],
    /*function(acct,ko, app, moduleUtils, accUtils,Model,ArrayDataProvider,
     CollectionDataProvider,ListDataProviderView) {*/
    function (accUtils, ko, Model, CollectionDataProvider, app, moduleUtils,
        ArrayDataProvider, ListDataProviderView, AnimationUtils, $, AsyncRegExpValidator) {
        function basicInfoViewModel(params) {
            $(".oj-web-applayout-footer").hide();
            $(".oj-hybrid-applayout-navbar-app").hide();
            var self = this;
            self.router = params.parentRouter;
            self.selectedChannel = ko.observable();
            self.selectedType = ko.observable();
            
            this.channelListSource = new ArrayDataProvider(channelList, {
                keyAttributes: "value",
            });

            
            self.typeListSource = new ArrayDataProvider(typeList, {
                keyAttributes: "value",
            });


            self.currentClass = ko.observable("Wholesale");
        

            /*------------------validation--------------------------*/
            self.accountName = ko.observable();
            self.nameValidator = [
                new AsyncRegExpValidator({
                    pattern: "[a-zA-Z s]{5,}",
                    hint: "enter at least 5 letters",
                    messageDetail: "Enter at least 5 letters and only letters are allowed",
                }),


            ];

            self.addAccountHeaderConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/addAccountHeader.html' }).then(function (view) {
                self.addAccountHeaderConfig({ 'view': view, 'viewModel': app.getAddAccountHeaderModel(self.router) })
            })

            self.goBack = function () {
                self.router.go({ path: 'dashboard', params: {} })
            }
            self.gotoAddressDetails = function () {
               
                let accountName = document.getElementById("accountName");
                let channel     = document.getElementById("channel");
                let type        = document.getElementById("type");

                accountName.validate().then((res1) => {
                    if(res1 != "valid")
                    {
                            accountName.focus();
                    }     
                    channel.validate().then((res2)=>{
                        type.validate().then((res2)=>{
                    if (res1 == "valid" && res2 == "valid" && res2 == "valid") {
                        //call address step of flow     
                        var basicObj =  {
                        "ACCOUNTNAME" :self.accountName(),
                        "ACCOUNTTYPE":self.selectedType(),
                        "ACCOUNTCHANNEL":self.selectedChannel(),
                        "ACCOUNTCLASS":self.currentClass()
                        }
                        
                        localStorage.setItem("ACCOUNTDETAILS",basicObj);
                         self.router.go({ path: 'addressDetails', params: basicObj });
                    }
                     });
                });
            });
            }
        }
        return basicInfoViewModel;
    });