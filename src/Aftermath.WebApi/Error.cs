﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;


/// <summary>
/// Utility class for creating and unwrapping <see cref="Exception"/> instances.
/// </summary>
internal static class Error
{
    private const string HttpScheme = "http";
    private const string HttpsScheme = "https";

    /// <summary>
    /// Formats the specified resource string using <see cref="M:System.Globalization.CultureInfo.CurrentCulture"/>.
    /// </summary>
    /// <param name="format">A composite format string.</param>
    /// <param name="args">An object array that contains zero or more objects to format.</param>
    /// <returns>The formatted string.</returns>
    public static string Format(string format, params object[] args)
    {
        return String.Format(CultureInfo.CurrentCulture, format, args);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with the provided properties.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException Argument(string messageFormat, params object[] messageArgs)
    {
        return new ArgumentException(Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with the provided properties.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException Argument(string parameterName, string messageFormat, params object[] messageArgs)
    {
        return new ArgumentException(Format(messageFormat, messageArgs), parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with a message saying that the argument must be an "http" or "https" URI.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException ArgumentUriNotHttpOrHttpsScheme(string parameterName, Uri actualValue)
    {
        return new ArgumentException(Format(Resources.ArgumentInvalidHttpUriScheme, actualValue, HttpScheme, HttpsScheme), parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with a message saying that the argument must be an absolute URI.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException ArgumentUriNotAbsolute(string parameterName, Uri actualValue)
    {
        return new ArgumentException(Format(Resources.ArgumentInvalidAbsoluteUri, actualValue), parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with a message saying that the argument must be an absolute URI 
    /// without a query or fragment identifier and then logs it with <see cref="F:System.Diagnostics.TraceLevel.Error"/>.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException ArgumentUriHasQueryOrFragment(string parameterName, Uri actualValue)
    {
        return new ArgumentException(Format(Resources.ArgumentUriHasQueryOrFragment, actualValue), parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentNullException"/> with the provided properties.
    /// </summary>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    [SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly", Justification = "The purpose of this API is to return an error for properties")]
    public static ArgumentNullException PropertyNull()
    {
        return new ArgumentNullException("value");
    }

    /// <summary>
    /// Creates an <see cref="ArgumentNullException"/> with the provided properties.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentNullException ArgumentNull(string parameterName)
    {
        return new ArgumentNullException(parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentNullException"/> with the provided properties.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentNullException ArgumentNull(string parameterName, string messageFormat, params object[] messageArgs)
    {
        return new ArgumentNullException(parameterName, Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> with a default message.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException ArgumentNullOrEmpty(string parameterName)
    {
        return Error.Argument(parameterName, Resources.ArgumentNullOrEmpty, parameterName);
    }

    /// <summary>
    /// Creates an <see cref="ArgumentOutOfRangeException"/> with the provided properties.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentOutOfRangeException ArgumentOutOfRange(string parameterName, object actualValue, string messageFormat, params object[] messageArgs)
    {
        return new ArgumentOutOfRangeException(parameterName, actualValue, Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="ArgumentOutOfRangeException"/> with a message saying that the argument must be greater than or equal to <paramref name="minValue"/>.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <param name="minValue">The minimum size of the argument.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentOutOfRangeException ArgumentMustBeGreaterThanOrEqualTo(string parameterName, object actualValue, object minValue)
    {
        return new ArgumentOutOfRangeException(parameterName, actualValue, Format(Resources.ArgumentMustBeGreaterThanOrEqualTo, minValue));
    }

    /// <summary>
    /// Creates an <see cref="ArgumentOutOfRangeException"/> with a message saying that the argument must be less than or equal to <paramref name="maxValue"/>.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="actualValue">The value of the argument that causes this exception.</param>
    /// <param name="maxValue">The maximum size of the argument.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentOutOfRangeException ArgumentMustBeLessThanOrEqualTo(string parameterName, object actualValue, object maxValue)
    {
        return new ArgumentOutOfRangeException(parameterName, actualValue, Format(Resources.ArgumentMustBeLessThanOrEqualTo, maxValue));
    }

    /// <summary>
    /// Creates an <see cref="System.Collections.Generic.KeyNotFoundException"/> with a message saying that the key was not found.
    /// </summary>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static KeyNotFoundException KeyNotFound()
    {
        return new KeyNotFoundException();
    }

    /// <summary>
    /// Creates an <see cref="System.Collections.Generic.KeyNotFoundException"/> with a message saying that the key was not found.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static KeyNotFoundException KeyNotFound(string messageFormat, params object[] messageArgs)
    {
        return new KeyNotFoundException(Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="ObjectDisposedException"/> initialized according to guidelines.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ObjectDisposedException ObjectDisposed(string messageFormat, params object[] messageArgs)
    {
        // Pass in null, not disposedObject.GetType().FullName as per the above guideline
        return new ObjectDisposedException(null, Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="OperationCanceledException"/> initialized with the provided parameters.
    /// </summary>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static OperationCanceledException OperationCanceled()
    {
        return new OperationCanceledException();
    }

    /// <summary>
    /// Creates an <see cref="OperationCanceledException"/> initialized with the provided parameters.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static OperationCanceledException OperationCanceled(string messageFormat, params object[] messageArgs)
    {
        return new OperationCanceledException(Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="ArgumentException"/> for an invalid enum argument.
    /// </summary>
    /// <param name="parameterName">The name of the parameter that caused the current exception.</param>
    /// <param name="invalidValue">The value of the argument that failed.</param>
    /// <param name="enumClass">A <see cref="Type"/> that represents the enumeration class with the valid values.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static ArgumentException InvalidEnumArgument(string parameterName, int invalidValue, Type enumClass)
    {
#if NETFX_CORE
            return new ArgumentException(Error.Format(Resources.InvalidEnumArgument, parameterName, invalidValue, enumClass.Name), parameterName);
#else
        return new InvalidEnumArgumentException(parameterName, invalidValue, enumClass);
#endif
    }

    /// <summary>
    /// Creates an <see cref="InvalidOperationException"/>.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static InvalidOperationException InvalidOperation(string messageFormat, params object[] messageArgs)
    {
        return new InvalidOperationException(Format(messageFormat, messageArgs));
    }

    /// <summary>
    /// Creates an <see cref="InvalidOperationException"/>.
    /// </summary>
    /// <param name="innerException">Inner exception</param>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static InvalidOperationException InvalidOperation(Exception innerException, string messageFormat, params object[] messageArgs)
    {
        return new InvalidOperationException(Format(messageFormat, messageArgs), innerException);
    }

    /// <summary>
    /// Creates an <see cref="NotSupportedException"/>.
    /// </summary>
    /// <param name="messageFormat">A composite format string explaining the reason for the exception.</param>
    /// <param name="messageArgs">An object array that contains zero or more objects to format.</param>
    /// <returns>The logged <see cref="Exception"/>.</returns>
    public static NotSupportedException NotSupported(string messageFormat, params object[] messageArgs)
    {
        return new NotSupportedException(Format(messageFormat, messageArgs));
    }
}