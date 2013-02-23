﻿using System;

namespace Aftermath {
    /// <summary>
    /// Attribute applied to a <see cref="DataController"/> method to indicate that it is a delete method.
    /// </summary>
    [AttributeUsage(
        AttributeTargets.Field | AttributeTargets.Method | AttributeTargets.Property,
        AllowMultiple = false, Inherited = true)]
    public sealed class DeleteAttribute : Attribute {}
}