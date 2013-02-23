
/// <reference path="Aftermath.d.ts" />


module vm {
    var dbContext = new aftermath.DbContext('/api/', '/api/metadata');



    var companiesQuery = dbContext.getDbSet('Basic.Models.Company, Basic');
    var people = dbContext.getDbSet('Basic.Models.Person, Basic');
    var departments = dbContext.getDbSet('Basic.Models.Department, Basic');


    export var nameFilter = ko.observable();
    export var selectedCompany = ko.observable();


    export var companies = companiesQuery.getEntities();
    export var filteredcompanies = companiesQuery
        .where(p => p('Name').contains(nameFilter))
        .getEntities();;



}



ko.applyBindings(vm);