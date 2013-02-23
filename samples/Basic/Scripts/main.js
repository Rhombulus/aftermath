var vm;
(function (vm) {
    var dbContext = new aftermath.DbContext('/api/', '/api/metadata');
    var companiesQuery = dbContext.getDbSet('Basic.Models.Company, Basic');
    var people = dbContext.getDbSet('Basic.Models.Person, Basic');
    var departments = dbContext.getDbSet('Basic.Models.Department, Basic');
    vm.nameFilter = ko.observable();
    vm.selectedCompany = ko.observable();
    vm.companies = companiesQuery.getEntities();
    vm.filteredcompanies = companiesQuery.where(function (p) {
        return p('Name').contains(vm.nameFilter);
    }).getEntities();
    ;
})(vm || (vm = {}));
ko.applyBindings(vm);
