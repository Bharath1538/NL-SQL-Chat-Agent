// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

// interface AuthFormProps {
//   mode: 'signin' | 'signup';
//   onSubmit: (data: any) => void;
//   loading: boolean;
//   error: string | null;
//   onModeChange: (mode: 'signin' | 'signup') => void;
// }

// export default function AuthForm({ mode, onSubmit, loading, error, onModeChange }: AuthFormProps) {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     confirmPassword: '',
//     designation:''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

//   const validateForm = () => {
//     const errors: Record<string, string> = {};

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       errors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!formData.password) {
//       errors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters long';
//     }

//     // Sign up specific validations
//     if (mode === 'signup') {
//       if (!formData.firstName) {
//         errors.firstName = 'First name is required';
//       }
//       if (!formData.lastName) {
//         errors.lastName = 'Last name is required';
//       }
//       if (!formData.confirmPassword) {
//         errors.confirmPassword = 'Please confirm your password';
//       } else if (formData.password !== formData.confirmPassword) {
//         errors.confirmPassword = 'Passwords do not match';
//       }
//       if (!formData.designation){
//         errors.designation = 'Designation is required';
//       }
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear validation error when user starts typing
//     if (validationErrors[field]) {
//       setValidationErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4">
//           <Sparkles className="w-8 h-8 text-white" />
//         </div>
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//           {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
//         </h1>
//         <p className="text-gray-600">
//           {mode === 'signin' 
//             ? 'Sign in to access your NL-SQL dashboard' 
//             : 'Join us to start querying your data with natural language'
//           }
//         </p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Sign up fields */}
//         {mode === 'signup' && (
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="firstName\" className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={(e) => handleInputChange('firstName', e.target.value)}
//                   className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                   }`}
//                   placeholder="John"
//                   disabled={loading}
//                 />
//               </div>
//               {validationErrors.firstName && (
//                 <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={(e) => handleInputChange('lastName', e.target.value)}
//                   className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                     validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                   }`}
//                   placeholder="Doe"
//                   disabled={loading}
//                 />
//               </div>
//               {validationErrors.lastName && (
//                 <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Email */}
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                 validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
//               }`}
//               placeholder="john@example.com"
//               disabled={loading}
//             />
//           </div>
//           {validationErrors.email && (
//             <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               value={formData.password}
//               onChange={(e) => handleInputChange('password', e.target.value)}
//               className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                 validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
//               }`}
//               placeholder="Enter your password"
//               disabled={loading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               disabled={loading}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//           {validationErrors.password && (
//             <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
//           )}
//         </div>

//         {/* Confirm Password (Sign up only) */}
//         {mode === 'signup' && (
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                 className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                   validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
//                 }`}
//                 placeholder="Confirm your password"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                 disabled={loading}
//               >
//                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//             {validationErrors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
//             )}
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
//             </>
//           ) : (
//             <>
//               {mode === 'signin' ? 'Sign In' : 'Create Account'}
//               <ArrowRight className="w-5 h-5" />
//             </>
//           )}
//         </button>

//         {/* Mode Switch */}
//         <div className="text-center pt-4 border-t border-gray-200">
//           <p className="text-gray-600">
//             {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
//             <button
//               type="button"
//               onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
//               className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
//               disabled={loading}
//             >
//               {mode === 'signin' ? 'Sign Up' : 'Sign In'}
//             </button>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: any) => void;
  loading: boolean;
  error: string | null;
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export default function AuthForm({ mode, onSubmit, loading, error, onModeChange }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    designation: '' // ✅ New field added
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters long';

    if (mode === 'signup') {
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';

      if (!formData.designation) errors.designation = 'Designation is required'; // ✅ Validate new field
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (mode === 'signup') {
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const payload = {
          employeeName: fullName,
          employeeEmail: formData.email,
          password: formData.password,
          reenterPassword: formData.confirmPassword,
          designation: formData.designation
        };
        onSubmit(payload);
      } else {
        onSubmit({
          employeeEmail: formData.email,
          password: formData.password
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600">
          {mode === 'signin'
            ? 'Sign in to access your NL-SQL dashboard'
            : 'Join us to start querying your data with natural language'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name & Last Name (Sign up only) */}
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="John"
                  disabled={loading}
                />
              </div>
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Doe"
                  disabled={loading}
                />
              </div>
              {validationErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password (Sign up only) */}
        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Designation (Sign up only) */}
        {mode === 'signup' && (
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.designation ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Enter your designation"
                disabled={loading}
              />
            </div>
            {validationErrors.designation && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.designation}</p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            <>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Mode Switch */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}