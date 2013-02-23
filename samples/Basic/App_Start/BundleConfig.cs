using System.Web;
using System.Web.Optimization;

namespace Basic {
    public class BundleConfig {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/all").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/knockout-{version}.js",
                        "~/Scripts/Aftermath.js",
                        "~/Scripts/main.js"
                        ));



            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));


        }
    }
}