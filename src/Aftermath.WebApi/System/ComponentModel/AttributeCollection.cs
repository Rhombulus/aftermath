using System.Collections.Generic;
using System.Linq;

namespace System.ComponentModel {
    internal class AttributeCollection<TAttribute> : AttributeCollection, IReadOnlyCollection<TAttribute> where TAttribute : Attribute {
        protected AttributeCollection() { }

        // ReSharper disable CoVariantArrayConversion


        internal AttributeCollection(Type componentType) : this(TypeDescriptor.GetAttributes(componentType).Cast<TAttribute>()) { }
        internal AttributeCollection(object component) : this(TypeDescriptor.GetAttributes(component).Cast<TAttribute>()) { }
        internal AttributeCollection(object component, bool noCustomTypeDesc) : this(TypeDescriptor.GetAttributes(component, noCustomTypeDesc).Cast<TAttribute>()) { }


        public AttributeCollection(IEnumerable<TAttribute> attributes) : this(attributes.ToArray()) { }
        public AttributeCollection(params TAttribute[] attributes) : base(attributes) { }

        // ReSharper restore CoVariantArrayConversion



        protected new IEnumerable<TAttribute> Attributes {
            get {
                return base.Attributes.Cast<TAttribute>();
            }
        }

        public new TAttribute this[int index] {
            get {
                return (TAttribute)base[index];
            }
        }

        public new TAttribute this[Type attributeType] {
            get {
                return (TAttribute)base[attributeType];
            }
        }

        public TResult Get<TResult>() where TResult : TAttribute {
            return (TResult)this[typeof(TResult)];
        }

        public new IEnumerator<TAttribute> GetEnumerator() {

            return base.Attributes.Cast<TAttribute>().GetEnumerator();
        }


    }
}