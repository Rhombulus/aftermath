using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using Aftermath.Helpers;
using Basic.Models;
using Newtonsoft.Json;

namespace Basic.Controllers {
    public class ValuesController : Aftermath.DbDataController<BasicDb> {

    [Queryable(PageSize = 10)]
        public IEnumerable<Company> GetCompanys() {
            return DbContext.Companies;
        }

    [Queryable(PageSize = 10)]
        public IEnumerable<Department> GetDepartments() {
            return DbContext.Departments;
        }

    [Queryable(PageSize = 10)]
        public IEnumerable<Person> GetPersons() {
            return DbContext.People;
        }


    }
}