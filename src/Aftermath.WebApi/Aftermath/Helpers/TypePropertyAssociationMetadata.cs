using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;

namespace Aftermath.Helpers {
    [DataContract]
    public class TypePropertyAssociationMetadata {
        public TypePropertyAssociationMetadata(AssociationAttribute associationAttr) {
            Name = associationAttr.Name;
            IsForeignKey = associationAttr.IsForeignKey;
            OtherKeyMembers = associationAttr.OtherKeyMembers;
            ThisKeyMembers = associationAttr.ThisKeyMembers;
        }
        [DataMember(Name = "name")]
        public string Name { get; private set; }
        [DataMember(Name = "isForeignKey")]
        public bool IsForeignKey { get; private set; }
        [DataMember(Name = "thisKey")]
        public IEnumerable<string> ThisKeyMembers { get; private set; }
        [DataMember(Name = "otherKey")]
        public IEnumerable<string> OtherKeyMembers { get; private set; }
    }
}