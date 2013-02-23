using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Basic.Models {
    public class Company {
        public Company() {
            Departments = new HashSet<Department>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Department> Departments { get; set; }
    }


    public class Department {
        public Department() {
            Employees = new HashSet<Person>();
        }
        public int Id { get; set; }
        public string Name { get; set; }

        public int CompanyId { get; set; }
        //public virtual Company Company { get; set; }

        public ICollection<Person> Employees { get; set; }
    }


    public class Person {
        public int Id { get; set; }
        public string Name { get; set; }

        public int DepartmentId { get; set; }
        //public virtual Department Department { get; set; }
    }
}


    

