using System.ComponentModel.DataAnnotations;

namespace Aftermath.Helpers {
    public class TypePropertyValidationRuleMetadata {
// ReSharper disable NotAccessedField.Local
        private readonly string _type;
// ReSharper restore NotAccessedField.Local

        public TypePropertyValidationRuleMetadata(RequiredAttribute attribute)
            : this((ValidationAttribute) attribute) {
            Name = "required";
            Value1 = true;
            _type = "boolean";
        }

        public TypePropertyValidationRuleMetadata(RangeAttribute attribute)
            : this((ValidationAttribute) attribute) {
            Name = "range";
            Value1 = attribute.Minimum;
            Value2 = attribute.Maximum;
            _type = "array";
        }

        public TypePropertyValidationRuleMetadata(StringLengthAttribute attribute)
            : this((ValidationAttribute) attribute) {
            if (attribute.MinimumLength != 0) {
                Name = "rangelength";
                Value1 = attribute.MinimumLength;
                Value2 = attribute.MaximumLength;
                _type = "array";
            }
            else {
                Name = "maxlength";
                Value1 = attribute.MaximumLength;
                _type = "number";
            }
        }

        public TypePropertyValidationRuleMetadata(DataTypeAttribute attribute)
            : this((ValidationAttribute) attribute) {
            switch (attribute.DataType) {
                case DataType.EmailAddress:
                    Name = "email";
                    break;
                case DataType.Url:
                default:
                    Name = "url";
                    break;
            }
            Value1 = true;
            _type = "boolean";
        }

        public TypePropertyValidationRuleMetadata(ValidationAttribute attribute) {
            if (attribute.ErrorMessage != null)
                ErrorMessageString = attribute.ErrorMessage;
        }

        public string Name { get; private set; }
        public object Value1 { get; private set; }
        public object Value2 { get; private set; }
        public string ErrorMessageString { get; private set; }
    }
}