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
        "ojs/ojindexermodeltreedataprovider",
        "ojs/ojbutton",
        "ojs/ojpopup",
        "ojs/ojradioset",
        "ojs/ojselectsingle",
        "ojs/ojbutton",
        "ojs/ojformlayout",
        "ojs/ojcheckboxset",
        "ojs/ojinputnumber",
        "ojs/ojswitch"
    ]
    , function (accUtils, ko, Model, CollectionDataProvider, app, moduleUtils,
        ArrayDataProvider, ListDataProviderView, AnimationUtils, $, AsyncRegExpValidator, IndexerModelTreeDataProvider) {
        function contactDetailsViewModel(params) {
            $(".oj-web-applayout-footer").hide();
            $(".oj-hybrid-applayout-navbar-app").hide();
            var self = this;
            self.router = params.parentRouter;
            self.args   = params.params.DATA;

            self.addAccountHeaderConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/addAccountHeader.html' }).then(function (view) {
                self.addAccountHeaderConfig({ 'view': view, 'viewModel': app.getAddAccountHeaderModel(self.router) })
            })


            self.selectedcontType = ko.observable("home");
            
            this.contactTypeSource = new ArrayDataProvider(contactTypeList, {
                keyAttributes: "value",
            });

            self.selectedPrefix = ko.observable("MR");
            
            this.prefixSource = new ArrayDataProvider(prefixList, {
                keyAttributes: "value",
            });

            self.fname = ko.observable();
            self.lname = ko.observable();

            self.fnameValidator = [
                new AsyncRegExpValidator({
                    pattern: "[a-zA-Z\s ]{1,10}",
                    hint: "Enter a first name",
                    messageDetail: "Enter a valid first name , only characters are allowed",
                }),
            ];
            self.lnameValidator = [
                new AsyncRegExpValidator({
                    pattern: "[a-zA-Z\s ]{1,10}",
                    hint: "Enter a last  name",
                    messageDetail: "Enter a valid last name , only characters are allowed",
                }),
            ];

            self.selectedcontactRole = ko.observable();

           
            this.contactRoleSource = new ArrayDataProvider(contactRoleList, {
                keyAttributes: "value",
            });

            self.selectedCC = ko.observable("+91")

            
            this.ccSource = new ArrayDataProvider(ccList, {
                keyAttributes: "value",
            });

            self.teleNumber = ko.observable();
            self.teleNumberValidator = [
                new AsyncRegExpValidator({
                    pattern: "^[1-9][0-9]{6,}$",
                    hint: "Enter a telePhone number",
                    messageDetail: "Enter a valid phine number",
                })
            ];

            self.email = ko.observable();
            self.emailValidator = [
                new AsyncRegExpValidator({
                    pattern: "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
                    hint: "Enter a email id ",
                    messageDetail: "Enter a valid email id",
                })
            ];

            self.preferredCont = ko.observable("e-mail");
            self.preferredContOptions = [
                { id: "MAIL", value: "e-mail" },
                { id: "PHONE", value: "Telephone" },
            ];

            self.status = ko.observable(true);


            self.gotoAdditionalInfo = function () {
                let fname   = document.getElementById("fname");
                let lname   = document.getElementById("lname");
                let teleNumber = document.getElementById("teleNumber");
                let email = document.getElementById("email");
                let role  = document.getElementById("contactRole");
                fname.validate().then((res1) => {
                    lname.validate().then((res2) => {
                            role.validate().then((res3) =>{
                                teleNumber.validate().then((res4) => {
                                    email.validate().then((res5) => {
                                        if(res1 != "valid"){
                                            fname.focus();
                                            return false;
                                        }
                                        if(res2 != "valid"){
                                            lname.focus();
                                            return false;
                                        }
                                        if(res4 != "valid"){
                                            teleNumber.focus();
                                            return false;
                                        }
                                        if(res5 != "valid"){
                                            email.focus();
                                            return false;
                                        }
                                if (res1 == "valid" && res2 == "valid" && res3 == "valid" && res4 == "valid" && res5 == "valid") {
                                    let obj = {
                                        
                                        "PRIMARYADDR":{
                                            "FIRSTNAME":self.fname(),
                                            "LASTNAME":self.lname(),
                                            "CONTACTTYPE":self.selectedcontType(),
                                            "PREFIX":self.selectedPrefix(),
                                            "CC":self.selectedCC(),
                                            "PHONENUM":self.teleNumber(),
                                            "EMAIL":self.email(),
                                            "ROLE":self.selectedcontactRole(),
                                            "PREFERREDCONT":self.preferredCont(),
                                            "CONTSTAUS":self.status()
                                        }
                                        
                                    }
                                    let json1 = JSON.parse(self.args);
                                    
                                    let strObj = {
                                        ...json1,
                                        ...obj
                                    }
                                     strObj = JSON.stringify(strObj);
                                    
                                    
                                    self.router.go({ path: 'additionalInfo', params: {"DATA":strObj} })
                                }
                            })
                        })
                    })
                })
           })
        }
            self.goBack = function () {
                self.router.go({ path: 'addressDetails', params: {} })
            }
            this.findAvailableSection = (section) => {
                let missing = this.dataProvider().getMissingSections();
                if (missing.indexOf(section) > -1) {
                    let sections = this.dataProvider().getIndexableSections();
                    let index = sections.indexOf(section);
                    if (index + 1 < sections.length) {
                        section = sections[index + 1];
                        return this.findAvailableSection(section);
                    }
                    return null;
                }
                return section;
            };
            this.handleSectionClick = (section) => {
                return new Promise((resolve, reject) => {
                    let availSection = this.findAvailableSection(section);
                    if (availSection != null) {
                        let key = availSection;
                        let listview = document.getElementById("listview");
                        listview.scrollToItem({ key: key });
                        resolve(availSection);
                    }
                    else {
                        resolve(section);
                    }
                });
            };
            this.itemOnly = (context) => {
                if (context.leaf !== undefined) {
                    return context.leaf;
                }
                else {
                    // should not happen
                    return true;
                }
            };
            self.pickContact = function () {
                navigator.contacts.pickContact(function (contact) {
                    console.log('The following contact has been selected:' + JSON.stringify(contact));
                    self.fname(contact.displayName.split(" ")[0] == null ? "" : contact.displayName.split(" ")[0]);
                    self.lname(contact.displayName.split(" ")[1] == null ? "" : contact.displayName.split(" ")[1]);
                    self.teleNumber(contact.phoneNumbers[0].value == null ? "" : contact.phoneNumbers[0].value.replace(/\D/g, '').slice(-10));
                    self.email(contact.emails == null ? "" : contact.emails[0].value);
                    self.selectedcontType(contact.phoneNumbers[0].type == null ? "mobile" : contact.phoneNumbers[0].type);
                }, function (err) {
                    console.log('Error: ' + err);
                });
            }

        }
        return contactDetailsViewModel;
    });