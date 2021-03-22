/**
  Copyright (c) 2015, 2021, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./show-account-details-view.html', './show-account-details-viewModel', 'text!./component.json', 'css!./show-account-details-styles'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('show-account-details', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);