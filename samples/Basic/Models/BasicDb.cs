using System;
using System.Data.Entity;
using System.Linq;

namespace Basic.Models {
    public class BasicDb : DbContext {
        static BasicDb() {
            Database.SetInitializer(new SeededInitializer());
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Person> People { get; set; }


        private class SeededInitializer : DropCreateDatabaseIfModelChanges<BasicDb> {
            protected override void Seed(BasicDb context) {

                var personNames = new[] { "Christopher", "Anderson", "Ronald", "Clark", "Mary", "Wright", "Lisa", "Mitchell", "Michelle", "Johnson", "Robert", "Lewis", "Paul", "Hill", "Kevin", "Roberts", "John", "Thomas", "Laura", "Williams", "Nancy", "Jackson", "Linda", "Jones", "Karen", "White", "Sarah", "Lee", "Michael", "Scott", "Mark", "Turner", "Jason", "Brown", "Barbara", "Harris", "Betty", "Walker", "Kimberly", "Green", "William", "Phillips", "Donald", "Davis", "Jeff", "Martin", "Elizabeth", "Hall", "Helen", "Adams", "Deborah", "Campbell", "David", "Miller", "George", "Thompson", "Jennifer", "Allen", "Sandra", "Baker", "Richard", "Parker", "Kenneth", "Wilson", "Maria", "Garcia", "Donna", "Young", "Charles", "Gonzalez", "Steven", "Evans", "Susan", "Moore", "Carol", "Martinez", "Joseph", "Hernandez", "Edward", "Nelson", "Margaret", "Edwards", "Ruth", "Taylor", "Thomas", "Robinson", "Brian", "King", "Dorothy", "Carter", "Sharon", "Collins", };
                var companyNames = new[] { "Shirley Plantation", "Tuttle's Red Barn", "Field View Farm", "Barker's Farm", "Seaside Inn", "White Horse Tavern", "Saunderskill", "Towle Silversmiths", "Orchards of Concklin", "Smiling Hill Farm", "Lakeside Mills", "Caswell-Massey", "Lorillard Tobacco Company", "Baker's", "Ames", "Dowse Orchards", "Greenbrier", "Willow Grove Inn", "Laird & Company", "D. Landreth Seed Company", "Bixler's", "Pittsburgh Post-Gazette", "Hayes", "King Arthur Flour", "Cadwalader, Wickersham & Taft", "CIGNA", "Old Farmer's Almanac", "State Street", "Temperance Tavern", "Baltimore Equitable", "Mutual Assurance", "Rochester Cables", "Warner", "Dixon", "Jim Beam", "Birkett Mills", "Gruber's Hagerstown Town & Country", "Wayside", "Alan McIlvain", "Pratt-Read", "W. Rose", "Crane & Co.", "Sawyer Bentwood", "DuPont", "Scovill", "Emmet, Marvin & Martin", "Colgate", "Sterling Sugars", "Wiley", "knowlton technologies", "International Silver", "Brown Brothers Harriman", "Hartford", "Pinaud", "Pfaltzgraff", "Riders", "Waterbury Button", "Waterbury Companies", "Citigroup", "ContiGroup", "Cooper, Erving & Savage", "Seth Thomas", "Louisville Stoneware", "Loane Brothers", "Hodgdon Yachts", "Remington", "Stark Brothers", "Taylor", "Claflin Equipment", "John Baer", "Breck's", "Brooks Brothers", "Eaton Funeral Homes", "Libbey Glass Inc.", "Marshall Elevator", "Jacob Bromwell", "Jobin Yvon" };
                var departmentNames = new[] { "Accounting", "Executive", "Manufacturing", "Admin & Clerical", "Franchise", "Nonprofit", "Banking & Finance", "Government", "Part Time", "Business Opportunities", "Health Care", "Retail", "Contract & Freelance", "Hospitality", "Sales & Marketing", "Customer Service", "Human Resources", "Science & Biotech", "Diversity Opportunities", "Information Technology", "Transportation", "Engineering", "Internships & College" };



                var random = new Random();


                personNames.SelectMany(fname =>
                    personNames.SelectMany(lname =>
                        Enumerable.Range(65, 26)
                            .Select(char.ConvertFromUtf32)
                            .Select(mi => string.Format("{0} {1}. {2}", fname, mi, lname))
                        )
                    )
                    .Where(c => random.Next(50) == 0)
                    .OrderBy(company => random.Next())
                    .GroupBy(_ => random.Next(companyNames.Length))
                    .Select(companyAssignments => new Company {
                        Name = companyNames[companyAssignments.Key],
                        Departments = companyAssignments.GroupBy(_ => random.Next(departmentNames.Length))
                            .Select(departmentAssignments => new Department {
                                Name = departmentNames[departmentAssignments.Key],
                                Employees = departmentAssignments.Select(fullname => new Person {
                                    Name = fullname
                                }).ToList()
                            })
                            .ToList()
                    })
                    .Select(context.Companies.Add)
                    .ToList();

            }
        }
    }
}