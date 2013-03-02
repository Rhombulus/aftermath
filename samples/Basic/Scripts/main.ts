
/// <reference path="Aftermath.d.ts" />





module dataContext {
    var dbContext = new aftermath.DbContext('/api/', '/api/metadata');
    export var companies = dbContext.getDbSet('Basic.Models.Company, Basic');
    export var people = dbContext.getDbSet('Basic.Models.Person, Basic');
    export var departments = dbContext.getDbSet('Basic.Models.Department, Basic');
}

module viewModel {

    export var nameFilter = ko.observable();
    export var selectedCompany = ko.observable();


    export var companies = dataContext.companies
        .where(p => p('Name').contains(nameFilter))
        .getEntities();;

}

ko.applyBindings(viewModel);





