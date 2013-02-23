using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Aftermath.Helpers {
    [DataContract]
    public class TypePropertyMetadata {
        private readonly PropertyDescriptor _propertyDescriptor;

        public TypePropertyMetadata(PropertyDescriptor descriptor) {
            _propertyDescriptor = descriptor;
            ValidationRules = new List<TypePropertyValidationRuleMetadata>();


            var elementType = TypeUtility.GetElementType(descriptor.PropertyType);


            IsArray = !(elementType == descriptor.PropertyType);


            var propertyAttributes = descriptor.ExplicitAttributes();


            IsKey = null != propertyAttributes[typeof (KeyAttribute)];


            // TODO, 336102, ReadOnlyAttribute for editability?  RIA used EditableAttribute?
            IsReadOnly = propertyAttributes.OfType<ReadOnlyAttribute>().Any(a => a.IsReadOnly);


            var associationAttr = propertyAttributes.OfType<AssociationAttribute>().SingleOrDefault();
            if (associationAttr != null)
                Association = new TypePropertyAssociationMetadata(associationAttr);


            var requiredAttribute = propertyAttributes.OfType<RequiredAttribute>().SingleOrDefault();
            if (requiredAttribute != null)
                ValidationRules.Add(new TypePropertyValidationRuleMetadata(requiredAttribute));

            #region Validation Rules

            var rangeAttribute = (RangeAttribute) propertyAttributes[typeof (RangeAttribute)];
            if (rangeAttribute != null) {
                var operandType = rangeAttribute.OperandType;
                operandType = Nullable.GetUnderlyingType(operandType) ?? operandType;
                if (operandType == typeof (Double)
                    || operandType == typeof (Int16)
                    || operandType == typeof (Int32)
                    || operandType == typeof (Int64)
                    || operandType == typeof (Single))
                    ValidationRules.Add(new TypePropertyValidationRuleMetadata(rangeAttribute));
            }


            var stringLengthAttribute = (StringLengthAttribute) propertyAttributes[typeof (StringLengthAttribute)];
            if (stringLengthAttribute != null)
                ValidationRules.Add(new TypePropertyValidationRuleMetadata(stringLengthAttribute));


            var dataTypeAttribute = (DataTypeAttribute) propertyAttributes[typeof (DataTypeAttribute)];
            if (dataTypeAttribute != null) {
                if (dataTypeAttribute.DataType.Equals(DataType.EmailAddress)
                    || dataTypeAttribute.DataType.Equals(DataType.Url))
                    ValidationRules.Add(new TypePropertyValidationRuleMetadata(dataTypeAttribute));
            }

            #endregion
        }

        public string Name {
            get {
                return _propertyDescriptor.Name;
            }
        }

        public Type Type {
            get {
                return TypeUtility.GetElementType(_propertyDescriptor.PropertyType);
            }
        }

        [DataMember(Name = "type")]
        public string TypeName {
            get {
                return Type.ToString("{1}.{0}, {2}");
            }
        }

        [DataMember(Name = "key")]
        public bool IsKey { get; private set; }

        [DataMember(Name = "readonly")]
        public bool IsReadOnly { get; private set; }

        [DataMember(Name = "array")]
        public bool IsArray { get; private set; }

        [DataMember(Name = "association")]
        public TypePropertyAssociationMetadata Association { get; private set; }


        public IList<TypePropertyValidationRuleMetadata> ValidationRules { get; private set; }
    }
}