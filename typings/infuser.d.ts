
interface Infuser {
    defaults: InfuserDefaults;
    postRender: (targetElement) =>void;
}
interface InfuserDefaults {
    templatePrefix: string;
    templateSuffix: string;
    templateUrl: string;
}
declare var infuser: Infuser;