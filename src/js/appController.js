/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcontext', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojthemeutils', 'ojs/ojmodule-element-utils', 'ojs/ojmoduleanimations', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojknockout', 'ojs/ojmodule-element'],
    function(ko, Context, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ThemeUtils, moduleUtils, ModuleAnimations, ArrayDataProvider, KnockoutTemplateUtils) {

        function ControllerViewModel() {
            var self = this;
            var routerObj;

            self.KnockoutTemplateUtils = KnockoutTemplateUtils;

            // Handle announcements sent when pages change, for Accessibility.
            self.manner = ko.observable('polite');
            self.message = ko.observable();

            document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

            function announcementHandler(event) {
                setTimeout(function() {
                    self.message(event.detail.message);
                    self.manner(event.detail.manner);
                }, 200);
            };

            // Save the theme so we can perform platform specific navigational animations
            var platform = ThemeUtils.getThemeTargetPlatform();

            var navData = [
                { path: '', redirect: 'dashboard' },
                { path: 'dashboard', detail: { label: 'Account List', iconClass: 'oj-ux-ico-bar-chart' } },
                { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
                { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
                { path: 'profile', detail: { label: 'Profile', iconClass: 'oj-ux-ico-contact' } },
                { path: 'basicInfo', detail: { label: 'Add Account', iconClass: '', header: 'Add account', stage: 1 } },
                { path: 'addressDetails', detail: { label: 'Add Account', iconClass: '', header: 'Add account', stage: 2 } },
                { path: 'contactDetails', detail: { label: 'Add Account', iconClass: '', header: 'Add account', stage: 3 } },
                { path: 'additionalInfo', detail: { label: 'Add Account', iconClass: '', header: 'Add account', stage: 4 } },
                { path: 'showAccountDetails', detail: { label: 'Account Details', iconClass: '', header: 'Account Details', stage: 4 } },
            ];
            // Router setup
            var router = new CoreRouter(navData, {
                urlAdapter: new UrlParamAdapter()
            });
            router.sync();

            this.moduleAdapter = new ModuleRouterAdapter(router, {
                animationCallback: platform === 'android' ?
                    function(animationContext) { return 'fade' } : undefined
            });

            this.selection = new KnockoutRouterAdapter(router);
            var navDataFooter = [
                { path: 'dashboard', detail: { label: 'Account List', iconClass: 'oj-ux-ico-bar-chart' } },
                { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
                { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
                { path: 'profile', detail: { label: 'Profile', iconClass: 'oj-ux-ico-contact' } },
            ];
            // Setup the navDataProvider with the routes, excluding the first redirected
            // route.
            this.navDataProvider = new ArrayDataProvider(navDataFooter, { keyAttributes: "path" });

            // Used by modules to get the current page title and adjust padding
            self.getHeaderModel = function() {
                // Return an object containing the current page title
                // and callback handler
                return {
                    pageTitle: self.selection.state().detail.label,
                    transitionCompleted: self.adjustContentPadding
                };
            };

            // aadd account header config
            self.getAddAccountHeaderModel = function(router) {
                routerObj = router;

                return {
                    stage: self.selection.state().detail.stage,
                    routerObj: router,
                    pathName: self.selection.state().path,
                    pageTitle: self.selection.state().detail.header,
                    transitionCompleted: self.adjustContentPadding
                };
            };
            self.backHandler = function(routerPath, routerObj) {
                switch (routerPath) {
                    case "basicInfo":
                        routerObj.go({ path: 'dashboard' })
                        break;
                    case "addressDetails":
                        routerObj.go({ path: 'basicInfo' })
                        break;
                    case "contactDetails":
                        routerObj.go({ path: 'addressDetails' })
                        break;
                    case "additionalInfo":
                        routerObj.go({ path: 'contactDetails' })
                        break;
                }
            }

            // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions.
            // This method should be called whenever your fixed region height may change.  The application
            // can also adjust content paddings with css classes if the fixed region height is not changing between
            // views.
            self.adjustContentPadding = function() {
                var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
                var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
                var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

                if (topElem) {
                    contentElem.style.paddingTop = (topElem.offsetHeight + 10) + 'px';
                }
                if (bottomElem) {
                    contentElem.style.paddingBottom = bottomElem.offsetHeight + 'px';
                }
                // Add oj-complete marker class to signal that the content area can be unhidden.
                // See the override.css file to see when the content area is hidden.
                contentElem.classList.add('oj-complete');
            }
        }
        // release the application bootstrap busy state
        Context.getPageContext().getBusyContext().applicationBootstrapComplete();

        return new ControllerViewModel();
    }
);