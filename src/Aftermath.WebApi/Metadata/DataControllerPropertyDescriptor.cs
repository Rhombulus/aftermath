using System;
using System.ComponentModel;

namespace Aftermath.Metadata {
    /// <summary>
    /// PropertyDescriptor wrapper.
    /// </summary>
    internal class DataControllerPropertyDescriptor : PropertyDescriptor {
        private readonly PropertyDescriptor _base;

        public DataControllerPropertyDescriptor(PropertyDescriptor descriptor, Attribute[] attributes)
            : base(descriptor, attributes) {
            _base = descriptor;
        }

        public override Type ComponentType {
            get {
                return _base.ComponentType;
            }
        }

        public override bool IsReadOnly {
            get {
                return _base.IsReadOnly;
            }
        }

        public override Type PropertyType {
            get {
                return _base.PropertyType;
            }
        }

        public override object GetValue(object component) {
            return _base.GetValue(component);
        }

        public override void SetValue(object component, object value) {
            _base.SetValue(component, value);
        }

        public override bool ShouldSerializeValue(object component) {
            return _base.ShouldSerializeValue(component);
        }

        public override bool CanResetValue(object component) {
            return _base.CanResetValue(component);
        }

        public override void ResetValue(object component) {
            _base.ResetValue(component);
        }
    }
}