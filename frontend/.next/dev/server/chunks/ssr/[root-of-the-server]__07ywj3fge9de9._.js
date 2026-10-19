module.exports = [
(()=>{"use strict";return[
"[project]/components/common/Badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Badge({ children, className, variant = 'default', size = 'md', ...props }) {
    const variantStyles = {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        teal: 'bg-teal-50 text-teal-800 border-teal-200 font-medium',
        navy: 'bg-[#0b1528] text-slate-100 border-[#1d335c]',
        warning: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
        critical: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
        outline: 'bg-transparent text-slate-600 border-slate-300'
    };
    const sizeStyles = {
        sm: 'text-[11px] px-2 py-0.5 rounded',
        md: 'text-xs px-2.5 py-1 rounded-md'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-1.5 font-medium border transition-colors', variantStyles[variant], sizeStyles[size], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/common/Badge.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/common/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref)=>{
    const variantStyles = {
        primary: 'bg-[#0b1528] text-white hover:bg-[#13223d] active:bg-[#070d18] border border-[#1b2f52] shadow-sm',
        secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200',
        teal: 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 border border-teal-700 shadow-sm',
        outline: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-none',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 shadow-xs'
    };
    const sizeStyles = {
        sm: 'text-xs px-2.5 py-1.5 rounded-md font-medium',
        md: 'text-sm px-3.5 py-2 rounded-lg font-medium',
        lg: 'text-base px-5 py-2.5 rounded-lg font-semibold',
        icon: 'p-2 rounded-lg'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        disabled: disabled || isLoading,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer', variantStyles[variant], sizeStyles[size], className),
        ...props,
        children: [
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                    }, void 0, false, {
                        fileName: "[project]/components/common/Button.tsx",
                        lineNumber: 62,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    }, void 0, false, {
                        fileName: "[project]/components/common/Button.tsx",
                        lineNumber: 70,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/common/Button.tsx",
                lineNumber: 57,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/common/Button.tsx",
        lineNumber: 45,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = 'Button';
}),
"[project]/components/layout/AppShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CityContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$TopNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/TopNav.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function AppShell({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CityProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen w-full overflow-hidden bg-[#f8fafc]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden lg:flex shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                        fileName: "[project]/components/layout/AppShell.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/AppShell.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex lg:hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity",
                            onClick: ()=>setMobileMenuOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/AppShell.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex flex-col w-72 max-w-xs bg-[#0b1528] shadow-2xl z-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                                fileName: "[project]/components/layout/AppShell.tsx",
                                lineNumber: 27,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/AppShell.tsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/AppShell.tsx",
                    lineNumber: 21,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col flex-1 min-w-0 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$TopNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopNav"], {
                            onMobileMenuToggle: ()=>setMobileMenuOpen(true)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/AppShell.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 overflow-y-auto bg-[#f8fafc] p-4 lg:p-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-7xl mx-auto space-y-6",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/components/layout/AppShell.tsx",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/AppShell.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/AppShell.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/AppShell.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/AppShell.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/layout/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$complex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-complex.mjs [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-compare.mjs [app-ssr] (ecmascript) <export default as GitCompare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.mjs [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.mjs [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.mjs [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.mjs [app-ssr] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CityContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Badge.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isSidebarCollapsed, toggleSidebar, selectedCity, gaps } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCity"])();
    const criticalGapsCount = gaps.filter((g)=>g.severity === 'Critical').length;
    const navItems = [
        {
            label: 'Overview',
            href: '/',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
            badge: null
        },
        {
            label: 'City Intelligence',
            href: '/intelligence',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$complex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
            badge: null
        },
        {
            label: 'City Comparison',
            href: '/comparison',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompare$3e$__["GitCompare"],
            badge: 'Benchmarking'
        },
        {
            label: 'Development Insights',
            href: '/insights',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
            badge: criticalGapsCount > 0 ? `${criticalGapsCount} Critical` : null,
            badgeVariant: 'critical'
        },
        {
            label: 'AI Policy Engine',
            href: '/policy-engine',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
            badge: 'Simulation',
            badgeVariant: 'teal'
        },
        {
            label: 'Growth Forecasts',
            href: '/forecasts',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
            badge: '2026-32'
        },
        {
            label: 'Citizen Engagement',
            href: '/citizen-engagement',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            badge: null
        },
        {
            label: 'Investor Marketplace',
            href: '/investor-marketplace',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
            badge: 'PPP'
        },
        {
            label: 'Reports & Dossiers',
            href: '/reports',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            badge: null
        },
        {
            label: 'Settings & Models',
            href: '/settings',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
            badge: null
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative flex flex-col bg-[#0b1528] text-slate-200 border-r border-[#1a2b49] transition-all duration-300 ease-in-out shrink-0 z-30 select-none', isSidebarCollapsed ? 'w-18' : 'w-64'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-16 flex items-center justify-between px-4 border-b border-[#1a2b49]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2.5 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 shadow-inner",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: "w-4 h-4 text-teal-400"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Sidebar.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-sm tracking-tight text-white flex items-center gap-1.5",
                                        children: [
                                            "CivicIntel",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30",
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/Sidebar.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] text-slate-400 truncate",
                                        children: "Urban Benchmarking Engine"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleSidebar,
                        "aria-label": isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar',
                        className: "p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#15233c] transition-colors",
                        children: isSidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2.5 bg-[#0e1a32] border-b border-[#1a2b49]/80 flex items-center justify-between text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-400 font-medium",
                        children: "Active Zone:"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-teal-300 capitalize flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            selectedCity
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto px-2.5 py-3 space-y-1",
                children: navItems.map((item)=>{
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        title: isSidebarCollapsed ? item.label : undefined,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150', isActive ? 'bg-teal-500/15 text-teal-200 border border-teal-500/30 font-semibold shadow-xs' : 'text-slate-300 hover:text-white hover:bg-[#14233c] border border-transparent'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200')
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 168,
                                columnNumber: 15
                            }, this),
                            !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center justify-between truncate",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 179,
                                        columnNumber: 19
                                    }, this),
                                    item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: item.badgeVariant || 'default',
                                        size: "sm",
                                        className: "ml-2 shrink-0 text-[10px] py-0 px-1.5",
                                        children: item.badge
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 181,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 178,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 157,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-t border-[#1a2b49] bg-[#091122]",
                children: !isSidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 text-[11px] text-slate-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                            className: "w-4 h-4 text-teal-400 shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col leading-tight",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-slate-300 font-medium",
                                    children: "Demonstration Mode"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Sidebar.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-slate-500",
                                    children: "Modeled Civic Analytics"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Sidebar.tsx",
                                    lineNumber: 203,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/Sidebar.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/Sidebar.tsx",
                    lineNumber: 199,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    title: "Verified Modeling Engine",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                        className: "w-4 h-4 text-teal-400"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 208,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/Sidebar.tsx",
                    lineNumber: 207,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/Sidebar.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/layout/TopNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopNav",
    ()=>TopNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-ssr] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CityContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/Badge.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function TopNav({ onMobileMenuToggle }) {
    const { selectedCity, setSelectedCity, activeStakeholder, setActiveStakeholder, selectedSector, setSelectedSector, searchQuery, setSearchQuery, cityProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CityContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCity"])();
    const [isCityDropdownOpen, setIsCityDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isStakeholderDropdownOpen, setIsStakeholderDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const stakeholderOptions = [
        {
            id: 'government',
            label: 'Government Officials',
            iconLabel: 'Govt'
        },
        {
            id: 'citizen',
            label: 'Citizens & Communities',
            iconLabel: 'Citizen'
        },
        {
            id: 'investor',
            label: 'Private Investors & PPPs',
            iconLabel: 'Investor'
        },
        {
            id: 'business',
            label: 'Commercial & Industry',
            iconLabel: 'Business'
        },
        {
            id: 'ngo',
            label: 'NGOs & Civil Society',
            iconLabel: 'NGO'
        }
    ];
    const sectorFilters = [
        {
            id: 'all',
            label: 'All Sectors'
        },
        {
            id: 'healthcare',
            label: 'Healthcare'
        },
        {
            id: 'education',
            label: 'Education'
        },
        {
            id: 'employment',
            label: 'Employment'
        },
        {
            id: 'infrastructure',
            label: 'Infrastructure'
        },
        {
            id: 'environment',
            label: 'Environment'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 shadow-2xs",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4 lg:px-6 h-16 flex items-center justify-between gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onMobileMenuToggle,
                            className: "p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg",
                            "aria-label": "Open navigation menu",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/TopNav.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsCityDropdownOpen(!isCityDropdownOpen),
                                    className: "flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 text-left transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/TopNav.tsx",
                                                lineNumber: 78,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5",
                                                    children: [
                                                        selectedCity === 'koraput' ? 'Koraput' : 'Bhubaneswar',
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-normal text-slate-500 hidden sm:inline",
                                                            children: "(Odisha)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                            lineNumber: 83,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-teal-700 font-medium truncate max-w-[140px] sm:max-w-none",
                                                    children: selectedCity === 'koraput' ? 'Aspirational District' : 'Benchmark Smart City'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-3.5 h-3.5 text-slate-400 ml-1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                isCityDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fixed inset-0 z-10",
                                            onClick: ()=>setIsCityDropdownOpen(false)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider",
                                                    children: "Select Demonstration City"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSelectedCity('koraput');
                                                        setIsCityDropdownOpen(false);
                                                    },
                                                    className: "w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-2 h-2 rounded-full mt-1.5 ${selectedCity === 'koraput' ? 'bg-teal-500 ring-2 ring-teal-200' : 'bg-slate-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-semibold text-slate-900",
                                                                            children: "Koraput"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                                            lineNumber: 121,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                            variant: "warning",
                                                                            size: "sm",
                                                                            children: "Developing Hub"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                                            lineNumber: 122,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                                    lineNumber: 120,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[11px] text-slate-500 mt-0.5",
                                                                    children: "14 Blocks, high tribal demographic, agro-forestry & healthcare focus."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                                    lineNumber: 126,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                            lineNumber: 119,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSelectedCity('bhubaneswar');
                                                        setIsCityDropdownOpen(false);
                                                    },
                                                    className: "w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors border-t border-slate-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-2 h-2 rounded-full mt-1.5 ${selectedCity === 'bhubaneswar' ? 'bg-teal-500 ring-2 ring-teal-200' : 'bg-slate-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-semibold text-slate-900",
                                                                            children: "Bhubaneswar"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                                            lineNumber: 146,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                            variant: "teal",
                                                                            size: "sm",
                                                                            children: "Capital Benchmark"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                                            lineNumber: 147,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                                    lineNumber: 145,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[11px] text-slate-500 mt-0.5",
                                                                    children: "67 Wards, Smart City operations, IT hub & tertiary healthcare baseline."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                                    lineNumber: 151,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/layout/TopNav.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 102,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedCity(selectedCity === 'koraput' ? 'bhubaneswar' : 'koraput'),
                            title: "Toggle between Koraput and Bhubaneswar",
                            className: "hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 shadow-2xs",
                            children: [
                                "Switch to ",
                                selectedCity === 'koraput' ? 'Bhubaneswar' : 'Koraput'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/TopNav.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsStakeholderDropdownOpen(!isStakeholderDropdownOpen),
                                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"], {
                                            className: "w-3.5 h-3.5 text-teal-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-400 font-normal hidden md:inline",
                                            children: "Lens:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-slate-900 capitalize",
                                            children: stakeholderOptions.find((s)=>s.id === activeStakeholder)?.iconLabel
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 181,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-3 h-3 text-slate-400"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                isStakeholderDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "fixed inset-0 z-10",
                                            onClick: ()=>setIsStakeholderDropdownOpen(false)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 189,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider",
                                                    children: "Stakeholder Perspective"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/TopNav.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 19
                                                }, this),
                                                stakeholderOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setActiveStakeholder(opt.id);
                                                            setIsStakeholderDropdownOpen(false);
                                                        },
                                                        className: "w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: activeStakeholder === opt.id ? 'font-bold text-teal-700' : 'text-slate-700 font-medium',
                                                                children: opt.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/TopNav.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 23
                                                            }, this),
                                                            activeStakeholder === opt.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-3.5 h-3.5 text-teal-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/TopNav.tsx",
                                                                lineNumber: 216,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, opt.id, true, {
                                                        fileName: "[project]/components/layout/TopNav.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/TopNav.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden xl:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200",
                            children: sectorFilters.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedSector(s.id),
                                    className: `px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${selectedSector === s.id ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`,
                                    children: s.label
                                }, s.id, false, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative hidden md:block w-44 lg:w-56",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Filter metrics, projects...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    className: "w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "primary",
                            size: "sm",
                            onClick: ()=>{
                                window.location.href = '/reports';
                            },
                            className: "hidden sm:inline-flex text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "w-3.5 h-3.5 text-teal-400"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden lg:inline",
                                    children: "Export Dossier"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/TopNav.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/TopNav.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/TopNav.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/TopNav.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/TopNav.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
}),
"[project]/context/CityContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CityProvider",
    ()=>CityProvider,
    "useCity",
    ()=>useCity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/cities.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/metrics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$gaps$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/gaps.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/recommendations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$forecasts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/forecasts.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mapData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/mapData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$citizenData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/citizenData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$projects$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/projects.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$activities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/activities.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
const CityContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CityProvider({ children }) {
    const [selectedCity, setSelectedCity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('koraput');
    const [activeStakeholder, setActiveStakeholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('government');
    const [selectedSector, setSelectedSector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [timeRange, setTimeRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('5Y');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleSidebar = ()=>setIsSidebarCollapsed((prev)=>!prev);
    const cityProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITIES_DATA"][selectedCity] || __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITIES_DATA"].koraput, [
        selectedCity
    ]);
    const benchmarkProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>selectedCity === 'koraput' ? __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITIES_DATA"].bhubaneswar : __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITIES_DATA"].koraput, [
        selectedCity
    ]);
    const kpis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITY_KPIS"][selectedCity] || [];
        if (selectedSector === 'all') return list;
        return list.filter((k)=>k.sector === selectedSector);
    }, [
        selectedCity,
        selectedSector
    ]);
    const gaps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$gaps$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEVELOPMENT_GAPS"].filter((gap)=>{
            const matchCity = gap.cityId === selectedCity;
            const matchSector = selectedSector === 'all' || gap.sector === selectedSector;
            const matchRole = activeStakeholder === 'government' || gap.targetStakeholders.includes(activeStakeholder);
            return matchCity && matchSector && matchRole;
        });
    }, [
        selectedCity,
        selectedSector,
        activeStakeholder
    ]);
    const recommendations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POLICY_RECOMMENDATIONS"].filter((rec)=>{
            const matchCity = rec.cityId === selectedCity;
            const matchSector = selectedSector === 'all' || rec.sector === selectedSector;
            const matchRole = activeStakeholder === 'government' || rec.keyStakeholders.includes(activeStakeholder);
            return matchCity && matchSector && matchRole;
        });
    }, [
        selectedCity,
        selectedSector,
        activeStakeholder
    ]);
    const projects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const list = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$projects$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INVESTOR_PROJECTS"][selectedCity] || [];
        if (selectedSector === 'all') return list;
        return list.filter((p)=>p.sector === selectedSector);
    }, [
        selectedCity,
        selectedSector
    ]);
    const feedback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$citizenData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CITIZEN_FEEDBACK_DATA"][selectedCity] || [];
    }, [
        selectedCity
    ]);
    const activities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$activities$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RECENT_ACTIVITIES"].filter((act)=>{
            const matchCity = act.cityId === selectedCity;
            const matchSector = selectedSector === 'all' || act.sector === selectedSector;
            return matchCity && matchSector;
        });
    }, [
        selectedCity,
        selectedSector
    ]);
    const forecasts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$forecasts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GROWTH_FORECASTS"][selectedCity] || [];
    }, [
        selectedCity
    ]);
    const assets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mapData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CIVIC_ASSETS"][selectedCity] || [];
    }, [
        selectedCity
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CityContext.Provider, {
        value: {
            selectedCity,
            setSelectedCity,
            activeStakeholder,
            setActiveStakeholder,
            selectedSector,
            setSelectedSector,
            timeRange,
            setTimeRange,
            searchQuery,
            setSearchQuery,
            isSidebarCollapsed,
            setIsSidebarCollapsed,
            toggleSidebar,
            cityProfile,
            benchmarkProfile,
            kpis,
            gaps,
            recommendations,
            projects,
            feedback,
            activities,
            forecasts,
            assets,
            comparisonMetrics: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$metrics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPARISON_METRICS"]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/CityContext.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function useCity() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
}
}),
"[project]/data/activities.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RECENT_ACTIVITIES",
    ()=>RECENT_ACTIVITIES
]);
const RECENT_ACTIVITIES = [
    {
        id: 'act-01',
        type: 'policy',
        title: 'District Mineral Foundation (DMF) approves ₹32 Cr Telemedicine Grid',
        timestamp: '2 hours ago',
        cityId: 'koraput',
        sector: 'healthcare',
        actor: 'District Planning Committee',
        summary: 'Sanctioned procurement of 24 all-terrain 4x4 mobile health clinics equipped with satellite telemetry to connect 180 tribal hamlets directly to SLN Medical College.',
        metricTag: 'Healthcare Access',
        statusBadge: 'Approved'
    },
    {
        id: 'act-02',
        type: 'milestone',
        title: 'Jal Jeevan Mission Solar Gravity Scheme reaches 48.2% Tap Coverage',
        timestamp: '5 hours ago',
        cityId: 'koraput',
        sector: 'infrastructure',
        actor: 'Rural Water Supply & Sanitation (RWSS)',
        summary: 'Completed multi-village solar-gravity reticulation commissioning for 34 highland tolas in Semiliguda and Pottangi blocks, providing safe piped water.',
        metricTag: 'Infrastructure',
        statusBadge: 'Milestone'
    },
    {
        id: 'act-03',
        type: 'investment',
        title: 'Expression of Interest floated for ₹85 Cr Mega Agro-Food Processing Park',
        timestamp: '1 day ago',
        cityId: 'koraput',
        sector: 'employment',
        actor: 'IDCO Odisha & District Administration',
        summary: 'Global tender issued for private concessionaire to establish curing, roasting, and vacuum packaging infrastructure for GI Koraput Coffee and organic ginger.',
        metricTag: 'Investor Pipeline',
        statusBadge: 'Tender Active'
    },
    {
        id: 'act-04',
        type: 'survey',
        title: 'Citizen Pulse Survey: 78% Jeypore respondents demand upgraded Trauma ICU',
        timestamp: '1 day ago',
        cityId: 'koraput',
        sector: 'healthcare',
        actor: 'CivicIntel Field Analytics',
        summary: 'Bi-annual civic survey of 1,420 citizens highlighted secondary health specialist retention as the number one public priority.',
        metricTag: 'Citizen Engagement',
        statusBadge: 'Field Report'
    },
    {
        id: 'act-05',
        type: 'milestone',
        title: 'Bhubaneswar Metro Phase-1: Elevated Viaduct Pier Piling crosses 60% mark',
        timestamp: '3 hours ago',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        actor: 'Bhubaneswar Metro Rail Corporation',
        summary: 'Construction progress on the Airport to Trishulia corridor remains ahead of schedule with 4 key elevated station slabs cast.',
        metricTag: 'Public Mobility',
        statusBadge: 'On Track'
    },
    {
        id: 'act-06',
        type: 'alert',
        title: 'BOC deploys automated IoT telemetry gates along Gangua Drainage Channel',
        timestamp: '6 hours ago',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        actor: 'Smart City Operations Center',
        summary: '14 ultrasonic water-level sensors activated across low-lying wards to provide automated 30-minute flash flood warnings to ward officers.',
        metricTag: 'Flood Resilience',
        statusBadge: 'Active Sensor'
    },
    {
        id: 'act-07',
        type: 'investment',
        title: 'Silicon Power commissions compound semiconductor testing pilot at Infovalley',
        timestamp: '2 days ago',
        cityId: 'bhubaneswar',
        sector: 'employment',
        actor: 'Odisha IT & ESDM Dept',
        summary: 'High-tech packaging facility begins preliminary cleanroom operations, creating 420 specialized electronics engineering positions.',
        metricTag: 'Tech Jobs',
        statusBadge: 'Commercial'
    }
];
}),
"[project]/data/cities.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITIES_DATA",
    ()=>CITIES_DATA
]);
const CITIES_DATA = {
    koraput: {
        id: 'koraput',
        name: 'Koraput',
        regionalTitle: 'Koraput District & Urban Cluster',
        state: 'Odisha',
        category: 'Aspirational District Hub',
        population: 1379647,
        populationLabel: '1.38 Million (District)',
        areaSqKm: 8807,
        literacyRate: 49.2,
        perCapitaIncomeInr: 68500,
        subdivisionsOrZones: 2,
        blocksOrWardsCount: 14,
        description: 'A bio-diverse, tribal-majority district situated in the picturesque Eastern Ghats of Southern Odisha. A designated aspirational zone endowed with rich horticultural resources (Koraput Organic Coffee, millets, spices), defense manufacturing (HAL Sunabeda, NALCO Damanjodi), and tremendous eco-tourism potential, while tackling structural deficits in secondary health outreach, all-weather connectivity in hinterlands, and technical higher education.',
        geography: 'Highland plateau & hills, average elevation 870m MSL, Eastern Ghats agro-climatic zone.',
        administrativeHQ: 'Koraput Town (Collectorate & DRDA)',
        keyStrengths: [
            'GI-tagged Koraput Coffee & Indigenous Organic Millet biodiversity',
            'Strategic Defense & Metallurgical clusters (HAL Aeronautics & NALCO Alumina)',
            'High forest canopy cover (38.5%) and rich watershed ecology',
            'Dedicated District Mineral Foundation (DMF) and OMBADC funding corpus'
        ],
        coreChallenges: [
            'Dispersed rural habitations causing last-mile healthcare transport lag',
            'Secondary-to-higher education dropout rates in interior tribal blocks',
            'Deficit in agro-processing cold-storage and value-addition infrastructure',
            'Lower formal non-agricultural employment generation for youth'
        ],
        coordinates: {
            lat: 18.8135,
            lng: 82.7123
        }
    },
    bhubaneswar: {
        id: 'bhubaneswar',
        name: 'Bhubaneswar',
        regionalTitle: 'Bhubaneswar Smart City & Capital Region',
        state: 'Odisha',
        category: 'Tier-2 Capital / Benchmark Smart City',
        population: 1115000,
        populationLabel: '1.12 Million (BMC Area)',
        areaSqKm: 422,
        literacyRate: 91.8,
        perCapitaIncomeInr: 215400,
        subdivisionsOrZones: 3,
        blocksOrWardsCount: 67,
        description: 'The administrative, educational, and information-technology powerhouse of Odisha. Ranked globally in early Smart City Mission phases, Bhubaneswar features state-of-the-art public transit (Mo Bus / Mo E-Ride), premier medical hubs (AIIMS, SUM, KIMS), prominent technology parks (Infocity, DLF Cybercity), and integrated municipal operations (Bhubaneswar Operations Centre - BOC).',
        geography: 'Coastal plains region, Mahanadi delta fringe, tropical savanna climate.',
        administrativeHQ: 'Bhubaneswar Municipal Corporation (BMC) & Secretariat',
        keyStrengths: [
            'Eastern India educational hub (IIT, NISER, AIIMS, KIIT, SOA, Utkal)',
            'Integrated public transit system (Mo Bus network with >250,000 daily ridership)',
            'Expanding IT & ESDM ecosystem with TCS, Infosys, Wipro, and semiconductor pilots',
            'High municipal digital governance index and centralized command center (BOC)'
        ],
        coreChallenges: [
            'Urban runoff & storm-water drainage overload in low-lying suburban wards',
            'Affordable housing and formal service delivery to peri-urban migrant clusters',
            'Peak summer urban heat island effects and peak electricity demand surges',
            'Traffic congestion on Cuttack-Bhubaneswar-Puri economic growth spine'
        ],
        coordinates: {
            lat: 20.2961,
            lng: 85.8245
        }
    }
};
}),
"[project]/data/citizenData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITIZEN_FEEDBACK_DATA",
    ()=>CITIZEN_FEEDBACK_DATA
]);
const CITIZEN_FEEDBACK_DATA = {
    koraput: [
        {
            id: 'fb-k-01',
            cityId: 'koraput',
            locality: 'Jeypore Sub-Division (Wards 1-28)',
            satisfactionScore: 68,
            primaryConcern: 'Secondary Healthcare Specialist Availability & Bus Terminal Congestion',
            respondentsCount: 1420,
            resolvedTicketsPercent: 78.4,
            topDemands: [
                'Expanded Pediatric ICU at SDH',
                'All-weather storm drains along Main Road',
                'Streetlighting in peri-urban wards'
            ]
        },
        {
            id: 'fb-k-02',
            cityId: 'koraput',
            locality: 'Koraput Municipality (Town Center)',
            satisfactionScore: 71,
            primaryConcern: 'Piped Water Pressure Fluctuation & Solid Waste Segregation',
            respondentsCount: 1180,
            resolvedTicketsPercent: 82.1,
            topDemands: [
                'Daily drinking water supply hours extension',
                'Door-to-door green waste collection',
                'Vocational youth computer center'
            ]
        },
        {
            id: 'fb-k-03',
            cityId: 'koraput',
            locality: 'Sunabeda NAC (HAL Aero Belt)',
            satisfactionScore: 76,
            primaryConcern: 'Broadband Network Outages & Skill Development Courses for Non-defense Youth',
            respondentsCount: 890,
            resolvedTicketsPercent: 86.5,
            topDemands: [
                'High-speed BharatNet fiber repairs',
                'Polytechnic aerospace technician course',
                'Recreational green community park'
            ]
        },
        {
            id: 'fb-k-04',
            cityId: 'koraput',
            locality: 'Kotpad Block & Weaver Clusters',
            satisfactionScore: 59,
            primaryConcern: 'Raw Material Subsidies for Handloom & Local Primary Health Sub-Center Doctors',
            respondentsCount: 740,
            resolvedTicketsPercent: 64.2,
            topDemands: [
                'Permanent MBBS doctor posting at CHC',
                'GI Handloom raw cotton yarn bank',
                'All-weather feeder roads to interior tolas'
            ]
        },
        {
            id: 'fb-k-05',
            cityId: 'koraput',
            locality: 'Bandhugaon Ghat Region (Rural / Tribal)',
            satisfactionScore: 48,
            primaryConcern: 'Ambulance Response Time & Mobile Tower Signal Reception',
            respondentsCount: 620,
            resolvedTicketsPercent: 51.0,
            topDemands: [
                '4x4 Off-road Ambulance Stationing',
                'New 4G Mobile Tower Installation',
                'Solar gravity drinking water tap in school'
            ]
        }
    ],
    bhubaneswar: [
        {
            id: 'fb-b-01',
            cityId: 'bhubaneswar',
            locality: 'Ward 12 - Patia & Infocity Corridor',
            satisfactionScore: 84,
            primaryConcern: 'Peak Morning Traffic at KIIT Square & Late Night Mo Bus Frequencies',
            respondentsCount: 3120,
            resolvedTicketsPercent: 93.6,
            topDemands: [
                'Dedicated bicycle track along Infocity Ave',
                'Mo E-Ride charging hubs at Metro stations',
                'Pedestrian zebra crossing timers'
            ]
        },
        {
            id: 'fb-b-02',
            cityId: 'bhubaneswar',
            locality: 'Ward 35 - Old Town & Heritage Perimeter',
            satisfactionScore: 79,
            primaryConcern: 'Heritage Area Traffic Management & Bindu Sagar Water Rejuvenation',
            respondentsCount: 2450,
            resolvedTicketsPercent: 89.2,
            topDemands: [
                'Pedestrian-only hours around Lingaraj Temple',
                'Underground electrical cable ducting',
                'Traditional craft artisan kiosk spaces'
            ]
        },
        {
            id: 'fb-b-03',
            cityId: 'bhubaneswar',
            locality: 'Ward 48 - Khandagiri & Baramunda Transit Hub',
            satisfactionScore: 81,
            primaryConcern: 'Automated Red Light Violation Enforcement & Commercial Parking',
            respondentsCount: 1980,
            resolvedTicketsPercent: 91.5,
            topDemands: [
                'Multi-level car parking facility',
                'Sound barriers near highway flyovers',
                'Expanded civic green verges'
            ]
        },
        {
            id: 'fb-b-04',
            cityId: 'bhubaneswar',
            locality: 'Ward 54 - Sundarpada Lowland Drainage Area',
            satisfactionScore: 65,
            primaryConcern: 'Monsoon Flash Waterlogging & Drainage Channel Desilting',
            respondentsCount: 1650,
            resolvedTicketsPercent: 74.8,
            topDemands: [
                'Deepening of Gangua Nallah secondary drains',
                'Automated stormwater pump station',
                'Vector-borne disease fogging frequency'
            ]
        }
    ]
};
}),
"[project]/data/forecasts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GROWTH_FORECASTS",
    ()=>GROWTH_FORECASTS
]);
const GROWTH_FORECASTS = {
    koraput: [
        {
            year: '2024',
            statusQuo: 54.7,
            acceleratedPolicy: 54.7,
            benchmarkPace: 82.6
        },
        {
            year: '2025',
            statusQuo: 56.9,
            acceleratedPolicy: 56.9,
            benchmarkPace: 83.9
        },
        {
            year: '2026',
            statusQuo: 58.4,
            acceleratedPolicy: 61.2,
            benchmarkPace: 84.7,
            milestone: 'Mobile Medical Van & Jal Jeevan Grid Launch'
        },
        {
            year: '2027',
            statusQuo: 60.1,
            acceleratedPolicy: 66.8,
            benchmarkPace: 86.2,
            milestone: 'Jeypore Agro-Processing Park Commissioned'
        },
        {
            year: '2028',
            statusQuo: 61.8,
            acceleratedPolicy: 72.4,
            benchmarkPace: 87.8,
            milestone: 'BharatNet 100% GP Fiber Bandwidth Active'
        },
        {
            year: '2029',
            statusQuo: 63.2,
            acceleratedPolicy: 77.1,
            benchmarkPace: 89.1,
            milestone: 'Eco-Tourism & Tribal Bio-Reserve Corridor'
        },
        {
            year: '2030',
            statusQuo: 64.9,
            acceleratedPolicy: 81.5,
            benchmarkPace: 90.5,
            milestone: 'Sub-Divisional Hospital Trauma Centre Upgrades'
        },
        {
            year: '2032',
            statusQuo: 67.5,
            acceleratedPolicy: 86.8,
            benchmarkPace: 92.5,
            milestone: 'Convergence with Tier-2 State Benchmark Achieved'
        }
    ],
    bhubaneswar: [
        {
            year: '2024',
            statusQuo: 82.6,
            acceleratedPolicy: 82.6,
            benchmarkPace: 85.0
        },
        {
            year: '2025',
            statusQuo: 83.9,
            acceleratedPolicy: 83.9,
            benchmarkPace: 86.8
        },
        {
            year: '2026',
            statusQuo: 84.7,
            acceleratedPolicy: 85.6,
            benchmarkPace: 88.0,
            milestone: 'AI Stormwater Basin Telemetry Deployed'
        },
        {
            year: '2027',
            statusQuo: 85.8,
            acceleratedPolicy: 88.2,
            benchmarkPace: 89.8,
            milestone: 'Bhubaneswar Metro Phase 1 Inauguration'
        },
        {
            year: '2028',
            statusQuo: 86.9,
            acceleratedPolicy: 90.7,
            benchmarkPace: 91.2,
            milestone: 'Net-Zero Municipal Solid Waste Processing'
        },
        {
            year: '2029',
            statusQuo: 87.8,
            acceleratedPolicy: 92.8,
            benchmarkPace: 92.6,
            milestone: 'Semiconductor Fabrication Pilot Operational'
        },
        {
            year: '2030',
            statusQuo: 88.6,
            acceleratedPolicy: 94.6,
            benchmarkPace: 94.0,
            milestone: '100% Piped Reclaimed Water for Urban Cooling'
        },
        {
            year: '2032',
            statusQuo: 90.1,
            acceleratedPolicy: 96.9,
            benchmarkPace: 96.0,
            milestone: 'Global Top-50 Liveable Smart Cities Ranking'
        }
    ]
};
}),
"[project]/data/gaps.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEVELOPMENT_GAPS",
    ()=>DEVELOPMENT_GAPS
]);
const DEVELOPMENT_GAPS = [
    {
        id: 'gap-k-01',
        title: 'Emergency Maternal & Pediatric Healthcare Response Transit Lag',
        cityId: 'koraput',
        sector: 'healthcare',
        severity: 'Critical',
        gapMetric: 'Average Emergency Response Time: 58 mins vs 14 mins Benchmark',
        currentStatus: '58 min average ambulance dispatch-to-hospital transit in interior blocks like Bandhugaon & Narayanpatna.',
        benchmarkStatus: '14 min transit in Bhubaneswar via dedicated GPS fleet and 108 trauma ambulances.',
        rootCauses: [
            'Ghat terrain with unpaved road gradients connecting interior tribal hamlets',
            'Shortage of ALS (Advanced Life Support) ambulances deployed at Sub-Divisional Hospital level',
            'Lack of real-time telemetry connectivity across hilly dead-zones'
        ],
        affectedPopulation: 'Approx. 410,000 rural and tribal residents across 6 hilly blocks',
        recommendedIntervention: 'Deploy 24 all-terrain 4x4 mobile medical units equipped with satellite telemetry, paired with drone-based emergency medicine delivery hubs at Jeypore and Koraput District HQ.',
        estimatedInvestmentCr: 28.5,
        projectedImpact: 'Reduce emergency transit time by 52%; cut maternal complication referral delays by 40%.',
        targetStakeholders: [
            'government',
            'ngo',
            'citizen'
        ]
    },
    {
        id: 'gap-k-02',
        title: 'Agro-Forestry & Coffee Value-Addition Deficit',
        cityId: 'koraput',
        sector: 'employment',
        severity: 'High',
        gapMetric: 'Local Agro-Processing Ratio: 14.2% vs 64.5% Benchmark',
        currentStatus: 'Over 85% of Koraput arabica coffee, ginger, and turmeric exported as raw unroasted/unprocessed commodities with minimal local value realization.',
        benchmarkStatus: 'Bhubaneswar ecosystem hosts food-testing labs, packaged food logistics hubs, and export certification agencies.',
        rootCauses: [
            'Absence of organized farmer producer organization (FPO) primary processing centers',
            'Limited commercial cold-chain storage facilities (only 2 operational across district)',
            'High logistics friction to Visakhapatnam and Paradip export ports'
        ],
        affectedPopulation: 'Over 120,000 tribal smallholder farmers and SHG micro-entrepreneurs',
        recommendedIntervention: 'Establish a 50-acre Mega Food Park & Organic Agro-Processing Hub in Jeypore corridor with common curing, roasting, solar drying, and vacuum packaging facilities.',
        estimatedInvestmentCr: 85.0,
        projectedImpact: 'Generate 4,800 direct non-farm jobs; increase farmgate realization by 38-45%.',
        targetStakeholders: [
            'government',
            'investor',
            'business'
        ]
    },
    {
        id: 'gap-k-03',
        title: 'Secondary-to-Higher Secondary STEM Transition Dropoff',
        cityId: 'koraput',
        sector: 'education',
        severity: 'High',
        gapMetric: 'STEM Stream Retention: 28.5% vs 68.2% Benchmark',
        currentStatus: 'While 5T High School transformation modernised 180+ schools, transition into science/math streams at +2 level plummets due to lack of trained science educators and lab infrastructure.',
        benchmarkStatus: 'Bhubaneswar has comprehensive science faculties in every government higher secondary school, backed by university mentorship.',
        rootCauses: [
            'Educator vacancy in physics, chemistry, and mathematics in interior colleges',
            'Language barrier during shift from Kui/Odia to technical English textbooks',
            'Long commuting distance to designated science colleges forcing hostel-dependent dropouts'
        ],
        affectedPopulation: 'Approx. 34,000 secondary students annually',
        recommendedIntervention: 'Introduce hybrid digital science learning labs with vernacular bilingual AI tutors, paired with incentive stipends for STEM teachers in tribal blocks.',
        estimatedInvestmentCr: 19.2,
        projectedImpact: 'Increase STEM enrollment to 45% within 3 years; reduce transition dropout by 30%.',
        targetStakeholders: [
            'government',
            'ngo',
            'citizen'
        ]
    },
    {
        id: 'gap-k-04',
        title: 'Highland Habitation Solar-Gravity Piped Drinking Water Deficit',
        cityId: 'koraput',
        sector: 'infrastructure',
        severity: 'Moderate',
        gapMetric: 'Household Piped Water: 48.2% vs 93.8% Benchmark',
        currentStatus: 'Conventional groundwater drilling fails in rocky highland plateaus; many habitations still rely on surface streams susceptible to seasonal turbidity.',
        benchmarkStatus: 'Bhubaneswar municipal network provides 24x7 Drink from Tap (Sujal) in majority wards.',
        rootCauses: [
            'Rugged elevation profiles render traditional electrical pump grids vulnerable to line faults',
            'Dispersed hamlet settlement pattern (under 100 households per tola)'
        ],
        affectedPopulation: '320,000 rural residents across 11 highland blocks',
        recommendedIntervention: 'Scale solar-powered multi-stage gravity flow piped water schemes utilizing perennial hill stream intakes, managed by women SHGs (Jal Sathis).',
        estimatedInvestmentCr: 42.0,
        projectedImpact: 'Achieve 82% household tap coverage by 2028; eliminate water-borne gastroenteritis peaks.',
        targetStakeholders: [
            'government',
            'ngo',
            'citizen'
        ]
    },
    {
        id: 'gap-b-01',
        title: 'Peri-Urban Stormwater Drainage Inundation & Runoff Overload',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        severity: 'High',
        gapMetric: 'Secondary Storm Drain Adequacy: 61% vs 90% National Benchmark',
        currentStatus: 'Intense monsoon downpours cause flash waterlogging along Gangua Nallah catchment, Jayadev Vihar underpasses, and Old Town heritage perimeter.',
        benchmarkStatus: 'Modern smart cities utilize automated flood gates, sponge-city retention basins, and permeable pavements.',
        rootCauses: [
            'Rapid concretization and loss of natural water bodies (pari-urban wetlands encroachment)',
            'Outdated natural drainage alignment unable to handle peak 70mm/hr precipitation events'
        ],
        affectedPopulation: 'Over 280,000 urban residents across 18 vulnerable wards',
        recommendedIntervention: 'Implement an Integrated Urban Sponge Basin & Stormwater Master Plan: desilt 10 primary drainage channels, create 4 eco-retention lakes, and install telemetry-linked automated sluices.',
        estimatedInvestmentCr: 145.0,
        projectedImpact: 'Eliminate chronic waterlogging hotspots; augment urban groundwater recharge by 22%.',
        targetStakeholders: [
            'government',
            'citizen',
            'business'
        ]
    },
    {
        id: 'gap-b-02',
        title: 'Peak-Hour Traffic Congestion on Capital-Industrial Corridors',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        severity: 'Moderate',
        gapMetric: 'Average Peak Travel Speed: 18.5 km/h vs 32 km/h Target',
        currentStatus: 'Heavy vehicular bottlenecks on Khandagiri-Patia arterial corridor and Rasulgarh-Cuttack expressway junction during 09:00-11:00 and 18:00-21:00.',
        benchmarkStatus: 'Leading global cities integrate multi-modal transit ticketing and grade-separated BRTS lanes.',
        rootCauses: [
            'High personal two-wheeler and four-wheeler ownership growth (9.8% YoY)',
            'Last-mile integration gaps between Mo Bus routes and peripheral IT parks'
        ],
        affectedPopulation: 'Approx. 450,000 daily commuters',
        recommendedIntervention: 'Accelerate Bhubaneswar Metro Phase-1 execution, deploy 300 additional Mo E-Ride feeder shuttles, and activate adaptive dynamic AI traffic signal sequencing at 42 major junctions.',
        estimatedInvestmentCr: 210.0,
        projectedImpact: 'Increase public transit mode share from 34% to 48%; reduce peak corridor transit time by 28%.',
        targetStakeholders: [
            'government',
            'business',
            'citizen',
            'investor'
        ]
    }
];
}),
"[project]/data/mapData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CIVIC_ASSETS",
    ()=>CIVIC_ASSETS
]);
const CIVIC_ASSETS = {
    koraput: [
        {
            id: 'kp-ast-01',
            name: 'Saheed Laxman Nayak Medical College & Hospital',
            cityId: 'koraput',
            type: 'healthcare',
            subType: 'Tertiary Teaching Hospital & 500-Bed Facility',
            locality: 'Koraput Town',
            status: 'Operational',
            coordinates: {
                lat: 18.8142,
                lng: 82.7168
            },
            metrics: [
                {
                    label: 'Beds',
                    value: '500 Active'
                },
                {
                    label: 'Daily OPD',
                    value: '1,450 Patients'
                },
                {
                    label: 'Telemedicine Node',
                    value: 'Active'
                }
            ]
        },
        {
            id: 'kp-ast-02',
            name: 'Jeypore Sub-Divisional Hospital & Trauma Care Unit',
            cityId: 'koraput',
            type: 'healthcare',
            subType: 'Secondary Referral Center',
            locality: 'Jeypore Sub-Division',
            status: 'Under Upgrade',
            coordinates: {
                lat: 18.8576,
                lng: 82.5701
            },
            metrics: [
                {
                    label: 'Beds',
                    value: '250 Expanded'
                },
                {
                    label: 'Emergency ICU',
                    value: '16 Beds'
                },
                {
                    label: 'Catchment',
                    value: '380k Pop.'
                }
            ]
        },
        {
            id: 'kp-ast-03',
            name: 'Central University of Odisha (CUO)',
            cityId: 'koraput',
            type: 'education',
            subType: 'Central University Campus',
            locality: 'Sunabeda Outskirts',
            status: 'Operational',
            coordinates: {
                lat: 18.7892,
                lng: 82.7831
            },
            metrics: [
                {
                    label: 'Students',
                    value: '2,800'
                },
                {
                    label: 'Tribal Studies Dept',
                    value: 'Core Focus'
                },
                {
                    label: 'Digital Lab',
                    value: 'Operational'
                }
            ]
        },
        {
            id: 'kp-ast-04',
            name: 'HAL Aeronautics Engine Manufacturing Division',
            cityId: 'koraput',
            type: 'industrial',
            subType: 'Strategic Defense Aerospace Unit',
            locality: 'Sunabeda Township',
            status: 'Operational',
            coordinates: {
                lat: 18.7492,
                lng: 82.8315
            },
            metrics: [
                {
                    label: 'Workforce',
                    value: '3,200 High-Tech'
                },
                {
                    label: 'Power Backup',
                    value: 'Dedicated Grid'
                },
                {
                    label: 'Skill Academy',
                    value: 'Active'
                }
            ]
        },
        {
            id: 'kp-ast-05',
            name: 'Koraput Agro-Coffee Research & Curing Hub',
            cityId: 'koraput',
            type: 'agriculture',
            subType: 'GI Coffee & Spice Processing Facility',
            locality: 'Pottangi-Koraput Belt',
            status: 'Operational',
            coordinates: {
                lat: 18.7624,
                lng: 82.7489
            },
            metrics: [
                {
                    label: 'Growers Covered',
                    value: '14,200 Farmers'
                },
                {
                    label: 'GI Certification',
                    value: 'Certified'
                },
                {
                    label: 'Annual Curing',
                    value: '1,800 MT'
                }
            ]
        },
        {
            id: 'kp-ast-06',
            name: 'Jeypore Regional Multi-Modal Transit Terminal & Airstrip',
            cityId: 'koraput',
            type: 'transit',
            subType: 'UDAN Regional Airway & Inter-District Bus Port',
            locality: 'Jeypore',
            status: 'Under Upgrade',
            coordinates: {
                lat: 18.8789,
                lng: 82.5592
            },
            metrics: [
                {
                    label: 'Daily Flights',
                    value: '3 Scheduled'
                },
                {
                    label: 'Bus Bays',
                    value: '28 Platforms'
                },
                {
                    label: 'Connectivity',
                    value: 'BBSR & Vizag'
                }
            ]
        },
        {
            id: 'kp-ast-07',
            name: 'Proposed Koraput Mega Agro & Cold Chain Terminal',
            cityId: 'koraput',
            type: 'agriculture',
            subType: 'PPP Agro-Logistics Park',
            locality: 'Kotpad Highway Junction',
            status: 'Proposed Cluster',
            coordinates: {
                lat: 18.9821,
                lng: 82.4215
            },
            metrics: [
                {
                    label: 'Planned Capex',
                    value: '₹85 Cr'
                },
                {
                    label: 'Direct Jobs',
                    value: '1,800 Planned'
                },
                {
                    label: 'Capacity',
                    value: '12,000 MT Cold'
                }
            ]
        },
        {
            id: 'kp-ast-08',
            name: 'Bandhugaon Tribal Health Outreach Center',
            cityId: 'koraput',
            type: 'healthcare',
            subType: 'Primary Community Health Center',
            locality: 'Bandhugaon Ghat Sector',
            status: 'Under Upgrade',
            coordinates: {
                lat: 18.9952,
                lng: 83.1892
            },
            metrics: [
                {
                    label: 'Coverage',
                    value: '42 Remote Villages'
                },
                {
                    label: 'Solar Power',
                    value: '10 kW Micro-Grid'
                },
                {
                    label: 'Mobile Unit',
                    value: 'Weekly Base'
                }
            ]
        }
    ],
    bhubaneswar: [
        {
            id: 'bbsr-ast-01',
            name: 'All India Institute of Medical Sciences (AIIMS)',
            cityId: 'bhubaneswar',
            type: 'healthcare',
            subType: 'Apex National Tertiary Hospital & Research Institute',
            locality: 'Sijua, Patrapada',
            status: 'Operational',
            coordinates: {
                lat: 20.2312,
                lng: 85.7725
            },
            metrics: [
                {
                    label: 'Beds',
                    value: '960 Inpatient'
                },
                {
                    label: 'Specialties',
                    value: '42 Super-Specialties'
                },
                {
                    label: 'Daily OPD',
                    value: '4,800 Patients'
                }
            ]
        },
        {
            id: 'bbsr-ast-02',
            name: 'Infocity Technology & Semiconductor SEZ',
            cityId: 'bhubaneswar',
            type: 'industrial',
            subType: 'IT/ITES & Electronics Export Cluster',
            locality: 'Patia IT Corridor',
            status: 'Operational',
            coordinates: {
                lat: 20.3541,
                lng: 85.8164
            },
            metrics: [
                {
                    label: 'IT Workforce',
                    value: '45,000+ Engineers'
                },
                {
                    label: 'Companies',
                    value: 'TCS, Infosys, Wipro'
                },
                {
                    label: 'Green Energy',
                    value: '38% Solar'
                }
            ]
        },
        {
            id: 'bbsr-ast-03',
            name: 'Bhubaneswar Operations Centre (BOC)',
            cityId: 'bhubaneswar',
            type: 'civic_office',
            subType: 'Integrated Smart City Command & Control Centre',
            locality: 'BMC Headquarters, Unit-9',
            status: 'Operational',
            coordinates: {
                lat: 20.2885,
                lng: 85.8361
            },
            metrics: [
                {
                    label: 'CCTV Feeds',
                    value: '1,200 Connected'
                },
                {
                    label: 'Sensor Nodes',
                    value: '450 Environmental'
                },
                {
                    label: 'Grievance SLA',
                    value: '94% On-Time'
                }
            ]
        },
        {
            id: 'bbsr-ast-04',
            name: 'Capital Hospital & Institute of Health Sciences',
            cityId: 'bhubaneswar',
            type: 'healthcare',
            subType: 'Premier State General Hospital',
            locality: 'Unit-6, Old Town Fringe',
            status: 'Operational',
            coordinates: {
                lat: 20.2618,
                lng: 85.8202
            },
            metrics: [
                {
                    label: 'Beds',
                    value: '750 Beds'
                },
                {
                    label: 'Trauma Care',
                    value: 'Level II'
                },
                {
                    label: 'Daily OPD',
                    value: '3,200 Patients'
                }
            ]
        },
        {
            id: 'bbsr-ast-05',
            name: 'IIT Bhubaneswar Research & Innovation Park',
            cityId: 'bhubaneswar',
            type: 'education',
            subType: 'National Premier Technical Institute',
            locality: 'Argul, Jatni Fringe',
            status: 'Operational',
            coordinates: {
                lat: 20.1482,
                lng: 85.6712
            },
            metrics: [
                {
                    label: 'Patents Filed',
                    value: '185+'
                },
                {
                    label: 'Incubated Startups',
                    value: '62 Tech Startups'
                },
                {
                    label: 'Campus Area',
                    value: '936 Acres'
                }
            ]
        },
        {
            id: 'bbsr-ast-06',
            name: 'Master Canteen Multi-Modal Transit Hub (Mo Bus)',
            cityId: 'bhubaneswar',
            type: 'transit',
            subType: 'Central Inter-City Railway & BRTS Interchange',
            locality: 'Station Square, Kharvel Nagar',
            status: 'Under Upgrade',
            coordinates: {
                lat: 20.2678,
                lng: 85.8429
            },
            metrics: [
                {
                    label: 'Daily Passengers',
                    value: '110,000 commuters'
                },
                {
                    label: 'Electric Buses',
                    value: '85 Charging Bays'
                },
                {
                    label: 'Integrated App',
                    value: 'Ama Bus QR'
                }
            ]
        },
        {
            id: 'bbsr-ast-07',
            name: 'Gangua Drainage Basin & Retention Eco-Park',
            cityId: 'bhubaneswar',
            type: 'civic_office',
            subType: 'Urban Stormwater & Ecological Wetland Channel',
            locality: 'Southern Peripheral Ward 54',
            status: 'Under Upgrade',
            coordinates: {
                lat: 20.2392,
                lng: 85.8321
            },
            metrics: [
                {
                    label: 'Channel Length',
                    value: '28.5 km'
                },
                {
                    label: 'Telemetry Level',
                    value: '14 Auto Gauges'
                },
                {
                    label: 'Retention Area',
                    value: '120 Hectares'
                }
            ]
        }
    ]
};
}),
"[project]/data/metrics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITY_KPIS",
    ()=>CITY_KPIS,
    "COMPARISON_METRICS",
    ()=>COMPARISON_METRICS
]);
const CITY_KPIS = {
    koraput: [
        {
            id: 'dev-score',
            title: 'Development Score',
            sector: 'governance',
            value: 58.4,
            displayValue: '58.4 / 100',
            unit: 'Composite Index',
            changePercent: 6.2,
            trend: 'up',
            benchmarkValue: 84.7,
            benchmarkDisplay: '84.7 / 100',
            benchmarkCity: 'Bhubaneswar',
            benchmarkDelta: '-26.3 pts vs Benchmark',
            status: 'warning',
            description: 'Composite Civic Intelligence Index calculated across health, basic services, economic vitality, and infrastructure.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 46.2,
                    benchmark: 76.5
                },
                {
                    year: '2022',
                    value: 49.0,
                    benchmark: 78.8
                },
                {
                    year: '2023',
                    value: 52.3,
                    benchmark: 80.9
                },
                {
                    year: '2024',
                    value: 54.7,
                    benchmark: 82.6
                },
                {
                    year: '2025',
                    value: 56.9,
                    benchmark: 83.9
                },
                {
                    year: '2026',
                    value: 58.4,
                    benchmark: 84.7
                }
            ]
        },
        {
            id: 'healthcare',
            title: 'Healthcare Access',
            sector: 'healthcare',
            value: 52.1,
            displayValue: '52.1 / 100',
            unit: 'Access Index',
            changePercent: 4.8,
            trend: 'up',
            benchmarkValue: 88.5,
            benchmarkDisplay: '88.5 / 100',
            benchmarkCity: 'Bhubaneswar',
            benchmarkDelta: '-36.4 pts vs Benchmark',
            status: 'critical',
            description: 'Evaluated by primary health center doctor density, emergency travel time within 45 min, and institutional delivery rates.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 41.5,
                    benchmark: 81.0
                },
                {
                    year: '2022',
                    value: 44.0,
                    benchmark: 83.2
                },
                {
                    year: '2023',
                    value: 47.1,
                    benchmark: 85.0
                },
                {
                    year: '2024',
                    value: 49.3,
                    benchmark: 86.8
                },
                {
                    year: '2025',
                    value: 50.8,
                    benchmark: 87.7
                },
                {
                    year: '2026',
                    value: 52.1,
                    benchmark: 88.5
                }
            ]
        },
        {
            id: 'education',
            title: 'Education Quality & Access',
            sector: 'education',
            value: 54.8,
            displayValue: '54.8 / 100',
            unit: 'Quality Index',
            changePercent: 5.1,
            trend: 'up',
            benchmarkValue: 89.2,
            benchmarkDisplay: '89.2 / 100',
            benchmarkCity: 'Bhubaneswar',
            benchmarkDelta: '-34.4 pts vs Benchmark',
            status: 'critical',
            description: 'Tracks elementary-to-secondary retention, pupil-to-teacher ratio (PTR), and smart-school digital enablement under 5T High School transformation.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 43.8,
                    benchmark: 82.1
                },
                {
                    year: '2022',
                    value: 46.5,
                    benchmark: 84.0
                },
                {
                    year: '2023',
                    value: 49.2,
                    benchmark: 86.2
                },
                {
                    year: '2024',
                    value: 51.6,
                    benchmark: 87.5
                },
                {
                    year: '2025',
                    value: 53.4,
                    benchmark: 88.4
                },
                {
                    year: '2026',
                    value: 54.8,
                    benchmark: 89.2
                }
            ]
        },
        {
            id: 'employment',
            title: 'Employment & Livelihood',
            sector: 'employment',
            value: 61.3,
            displayValue: '61.3 / 100',
            unit: 'Livelihood Index',
            changePercent: 7.4,
            trend: 'up',
            benchmarkValue: 79.4,
            benchmarkDisplay: '79.4 / 100',
            benchmarkCity: 'Bhubaneswar',
            benchmarkDelta: '-18.1 pts vs Benchmark',
            status: 'warning',
            description: 'Reflects formal non-farm employment ratio, female self-help group (SHG) enterprise revenue, and value-added agro-forestry output.',
            dataConfidence: 'Medium (Census & Survey Proxy)',
            historicalData: [
                {
                    year: '2021',
                    value: 48.0,
                    benchmark: 71.0
                },
                {
                    year: '2022',
                    value: 51.2,
                    benchmark: 73.5
                },
                {
                    year: '2023',
                    value: 54.8,
                    benchmark: 75.8
                },
                {
                    year: '2024',
                    value: 57.3,
                    benchmark: 77.2
                },
                {
                    year: '2025',
                    value: 59.5,
                    benchmark: 78.4
                },
                {
                    year: '2026',
                    value: 61.3,
                    benchmark: 79.4
                }
            ]
        },
        {
            id: 'infrastructure',
            title: 'Physical & Digital Infra',
            sector: 'infrastructure',
            value: 63.7,
            displayValue: '63.7 / 100',
            unit: 'Infra Index',
            changePercent: 8.2,
            trend: 'up',
            benchmarkValue: 86.0,
            benchmarkDisplay: '86.0 / 100',
            benchmarkCity: 'Bhubaneswar',
            benchmarkDelta: '-22.3 pts vs Benchmark',
            status: 'warning',
            description: 'All-weather road connectivity to habitations >250 pop, rural piped drinking water tap coverage, and 4G/5G mobile tower penetration.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 47.9,
                    benchmark: 77.0
                },
                {
                    year: '2022',
                    value: 51.8,
                    benchmark: 79.5
                },
                {
                    year: '2023',
                    value: 55.4,
                    benchmark: 82.0
                },
                {
                    year: '2024',
                    value: 58.7,
                    benchmark: 83.8
                },
                {
                    year: '2025',
                    value: 61.2,
                    benchmark: 85.1
                },
                {
                    year: '2026',
                    value: 63.7,
                    benchmark: 86.0
                }
            ]
        }
    ],
    bhubaneswar: [
        {
            id: 'dev-score',
            title: 'Development Score',
            sector: 'governance',
            value: 84.7,
            displayValue: '84.7 / 100',
            unit: 'Composite Index',
            changePercent: 3.8,
            trend: 'up',
            benchmarkValue: 88.0,
            benchmarkDisplay: '88.0 / 100',
            benchmarkCity: 'National Smart City Benchmark',
            benchmarkDelta: '+19.2 pts vs State Avg',
            status: 'benchmark',
            description: 'High-performing urban ecosystem driven by institutional density, smart transit systems, and robust tertiary services.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 76.5,
                    benchmark: 79.0
                },
                {
                    year: '2022',
                    value: 78.8,
                    benchmark: 81.2
                },
                {
                    year: '2023',
                    value: 80.9,
                    benchmark: 83.5
                },
                {
                    year: '2024',
                    value: 82.6,
                    benchmark: 85.0
                },
                {
                    year: '2025',
                    value: 83.9,
                    benchmark: 86.8
                },
                {
                    year: '2026',
                    value: 84.7,
                    benchmark: 88.0
                }
            ]
        },
        {
            id: 'healthcare',
            title: 'Healthcare Access',
            sector: 'healthcare',
            value: 88.5,
            displayValue: '88.5 / 100',
            unit: 'Access Index',
            changePercent: 2.9,
            trend: 'up',
            benchmarkValue: 90.0,
            benchmarkDisplay: '90.0 / 100',
            benchmarkCity: 'Tier-1 Metro Average',
            benchmarkDelta: '+23.5 pts vs State Avg',
            status: 'benchmark',
            description: 'Comprehensive super-specialty infrastructure led by AIIMS Bhubaneswar, Capital Hospital, and multiple private medical colleges.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 81.0,
                    benchmark: 83.0
                },
                {
                    year: '2022',
                    value: 83.2,
                    benchmark: 85.0
                },
                {
                    year: '2023',
                    value: 85.0,
                    benchmark: 87.0
                },
                {
                    year: '2024',
                    value: 86.8,
                    benchmark: 88.5
                },
                {
                    year: '2025',
                    value: 87.7,
                    benchmark: 89.2
                },
                {
                    year: '2026',
                    value: 88.5,
                    benchmark: 90.0
                }
            ]
        },
        {
            id: 'education',
            title: 'Education Quality & Access',
            sector: 'education',
            value: 89.2,
            displayValue: '89.2 / 100',
            unit: 'Quality Index',
            changePercent: 3.1,
            trend: 'up',
            benchmarkValue: 91.5,
            benchmarkDisplay: '91.5 / 100',
            benchmarkCity: 'Tier-1 Metro Average',
            benchmarkDelta: '+22.4 pts vs State Avg',
            status: 'benchmark',
            description: 'Eastern India knowledge hub with dense university clusters, near universal gross enrollment at elementary level, and advanced research facilities.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 82.1,
                    benchmark: 84.5
                },
                {
                    year: '2022',
                    value: 84.0,
                    benchmark: 86.2
                },
                {
                    year: '2023',
                    value: 86.2,
                    benchmark: 88.0
                },
                {
                    year: '2024',
                    value: 87.5,
                    benchmark: 89.5
                },
                {
                    year: '2025',
                    value: 88.4,
                    benchmark: 90.5
                },
                {
                    year: '2026',
                    value: 89.2,
                    benchmark: 91.5
                }
            ]
        },
        {
            id: 'employment',
            title: 'Employment & Livelihood',
            sector: 'employment',
            value: 79.4,
            displayValue: '79.4 / 100',
            unit: 'Livelihood Index',
            changePercent: 4.6,
            trend: 'up',
            benchmarkValue: 84.0,
            benchmarkDisplay: '84.0 / 100',
            benchmarkCity: 'National Tech Hubs',
            benchmarkDelta: '+16.2 pts vs State Avg',
            status: 'positive',
            description: 'Strong services and technology employment footprint; ongoing shift toward semiconductor, electronics manufacturing, and high-value knowledge jobs.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 71.0,
                    benchmark: 75.0
                },
                {
                    year: '2022',
                    value: 73.5,
                    benchmark: 77.5
                },
                {
                    year: '2023',
                    value: 75.8,
                    benchmark: 80.0
                },
                {
                    year: '2024',
                    value: 77.2,
                    benchmark: 81.8
                },
                {
                    year: '2025',
                    value: 78.4,
                    benchmark: 83.0
                },
                {
                    year: '2026',
                    value: 79.4,
                    benchmark: 84.0
                }
            ]
        },
        {
            id: 'infrastructure',
            title: 'Physical & Digital Infra',
            sector: 'infrastructure',
            value: 86.0,
            displayValue: '86.0 / 100',
            unit: 'Infra Index',
            changePercent: 3.5,
            trend: 'up',
            benchmarkValue: 89.0,
            benchmarkDisplay: '89.0 / 100',
            benchmarkCity: 'National Smart City Benchmark',
            benchmarkDelta: '+21.0 pts vs State Avg',
            status: 'benchmark',
            description: 'High-coverage paved urban road network, smart bus rapid transit, optical fiber backbone, and modern solid-waste management facilities.',
            dataConfidence: 'High (Verified Model)',
            historicalData: [
                {
                    year: '2021',
                    value: 77.0,
                    benchmark: 81.0
                },
                {
                    year: '2022',
                    value: 79.5,
                    benchmark: 83.2
                },
                {
                    year: '2023',
                    value: 82.0,
                    benchmark: 85.5
                },
                {
                    year: '2024',
                    value: 83.8,
                    benchmark: 87.0
                },
                {
                    year: '2025',
                    value: 85.1,
                    benchmark: 88.0
                },
                {
                    year: '2026',
                    value: 86.0,
                    benchmark: 89.0
                }
            ]
        }
    ]
};
const COMPARISON_METRICS = [
    {
        id: 'm1',
        category: 'healthcare',
        metricName: 'Doctors per 10,000 Population',
        unit: 'Doctors / 10k',
        koraputValue: 4.8,
        koraputDisplay: '4.8',
        bhubaneswarValue: 24.2,
        bhubaneswarDisplay: '24.2',
        stateAvg: 9.2,
        stateAvgDisplay: '9.2',
        nationalTarget: 10.0,
        gapPercentage: -80.2,
        priority: 'Critical',
        runwayYears: 6.5,
        notes: 'Severe deficit in remote primary health sub-centers; specialists concentrated in Jeypore.'
    },
    {
        id: 'm2',
        category: 'healthcare',
        metricName: 'Hospital Bed Density',
        unit: 'Beds / 1,000 pop',
        koraputValue: 0.95,
        koraputDisplay: '0.95',
        bhubaneswarValue: 4.1,
        bhubaneswarDisplay: '4.10',
        stateAvg: 1.6,
        stateAvgDisplay: '1.60',
        nationalTarget: 2.0,
        gapPercentage: -76.8,
        priority: 'Critical',
        runwayYears: 5.0,
        notes: 'District Hospital Koraput & SLN Medical College expanding to bridge secondary care bed shortage.'
    },
    {
        id: 'm3',
        category: 'education',
        metricName: 'Secondary School Retention Rate',
        unit: '% Students',
        koraputValue: 61.4,
        koraputDisplay: '61.4%',
        bhubaneswarValue: 94.6,
        bhubaneswarDisplay: '94.6%',
        stateAvg: 76.8,
        stateAvgDisplay: '76.8%',
        nationalTarget: 90.0,
        gapPercentage: -35.1,
        priority: 'High',
        runwayYears: 4.2,
        notes: 'Seasonal agrarian migration and language transition from tribal dialects to Odia/English impact retention.'
    },
    {
        id: 'm4',
        category: 'education',
        metricName: 'Higher Secondary STEM Enrollment',
        unit: '% of 11th/12th Students',
        koraputValue: 28.5,
        koraputDisplay: '28.5%',
        bhubaneswarValue: 68.2,
        bhubaneswarDisplay: '68.2%',
        stateAvg: 44.1,
        stateAvgDisplay: '44.1%',
        nationalTarget: 55.0,
        gapPercentage: -58.2,
        priority: 'High',
        runwayYears: 4.8,
        notes: 'Shortage of dedicated physics/chemistry laboratory equipment in interior sub-divisional colleges.'
    },
    {
        id: 'm5',
        category: 'infrastructure',
        metricName: 'Piped Drinking Water Household Coverage',
        unit: '% Households',
        koraputValue: 48.2,
        koraputDisplay: '48.2%',
        bhubaneswarValue: 93.8,
        bhubaneswarDisplay: '93.8%',
        stateAvg: 67.4,
        stateAvgDisplay: '67.4%',
        nationalTarget: 100.0,
        gapPercentage: -48.6,
        priority: 'High',
        runwayYears: 3.5,
        notes: 'Topography challenges in hilly terrain being tackled through Jal Jeevan Mission multi-village solar gravity piped schemes.'
    },
    {
        id: 'm6',
        category: 'infrastructure',
        metricName: 'All-Weather Road Habitation Connectivity',
        unit: '% Eligible Habitations',
        koraputValue: 74.6,
        koraputDisplay: '74.6%',
        bhubaneswarValue: 99.2,
        bhubaneswarDisplay: '99.2%',
        stateAvg: 86.5,
        stateAvgDisplay: '86.5%',
        nationalTarget: 100.0,
        gapPercentage: -24.8,
        priority: 'Medium',
        runwayYears: 3.0,
        notes: 'Pradhan Mantri Gram Sadak Yojana (PMGSY) has accelerated connectivity; ghat sections require reinforced retaining walls.'
    },
    {
        id: 'm7',
        category: 'infrastructure',
        metricName: 'High-Speed Broadband Household Penetration',
        unit: '% Households',
        koraputValue: 24.1,
        koraputDisplay: '24.1%',
        bhubaneswarValue: 88.5,
        bhubaneswarDisplay: '88.5%',
        stateAvg: 51.2,
        stateAvgDisplay: '51.2%',
        nationalTarget: 80.0,
        gapPercentage: -72.8,
        priority: 'High',
        runwayYears: 3.8,
        notes: 'BharatNet Phase II fiber rollout active across 240 Gram Panchayats.'
    },
    {
        id: 'm8',
        category: 'employment',
        metricName: 'Formal Non-Agricultural Employment',
        unit: '% Total Workforce',
        koraputValue: 26.8,
        koraputDisplay: '26.8%',
        bhubaneswarValue: 84.1,
        bhubaneswarDisplay: '84.1%',
        stateAvg: 48.5,
        stateAvgDisplay: '48.5%',
        nationalTarget: 60.0,
        gapPercentage: -68.1,
        priority: 'Critical',
        runwayYears: 5.5,
        notes: 'Majority engaged in subsistence horticulture; massive scope for coffee curing, spice extraction, and food processing.'
    },
    {
        id: 'm9',
        category: 'governance',
        metricName: 'Municipal Digital Service Delivery Ratio',
        unit: '% Services Online',
        koraputValue: 56.0,
        koraputDisplay: '56.0%',
        bhubaneswarValue: 96.5,
        bhubaneswarDisplay: '96.5%',
        stateAvg: 74.0,
        stateAvgDisplay: '74.0%',
        nationalTarget: 100.0,
        gapPercentage: -42.0,
        priority: 'Medium',
        runwayYears: 2.2,
        notes: 'Odisha Right to Public Services Act (ORTPSA) integration expanding across NACs and urban local bodies.'
    },
    {
        id: 'm10',
        category: 'environment',
        metricName: 'Solid Waste Segregation & Processing',
        unit: '% Municipal Waste Processed',
        koraputValue: 42.5,
        koraputDisplay: '42.5%',
        bhubaneswarValue: 87.2,
        bhubaneswarDisplay: '87.2%',
        stateAvg: 63.8,
        stateAvgDisplay: '63.8%',
        nationalTarget: 100.0,
        gapPercentage: -51.3,
        priority: 'Medium',
        runwayYears: 2.5,
        notes: 'Micro-Composting Centers (MCCs) active in Jeypore and Koraput Municipality; rural clusters require decentralized bio-digestion.'
    }
];
}),
"[project]/data/projects.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INVESTOR_PROJECTS",
    ()=>INVESTOR_PROJECTS
]);
const INVESTOR_PROJECTS = {
    koraput: [
        {
            id: 'proj-kp-01',
            title: 'Koraput Valley Organic Coffee & Spices Integrated Curing Complex',
            cityId: 'koraput',
            sector: 'employment',
            location: 'Jeypore-Borigumma Industrial Growth Corridor',
            projectType: 'PPP',
            capexInCr: 85.0,
            expectedIrrPercent: 18.5,
            esgRating: 'A+',
            status: 'Land Bank Allocated',
            directJobs: 1450,
            brief: 'A 40-acre state-of-the-art facility featuring coffee pulping, curing, grading, nitrogen vacuum sealing, and an international roasting certification lab to unlock direct exports to Europe and Japan.',
            highlights: [
                'Guaranteed backward linkage with 18 tribal Farmer Producer Organizations (FPOs)',
                'State capital subsidy up to 30% under Odisha Agriculture Policy',
                'Direct road access to NH-26 with link to Visakhapatnam Port (240 km)'
            ]
        },
        {
            id: 'proj-kp-02',
            title: 'Kolab Hydro Reservoir Eco-Tourism & Watersports Experiential Circuit',
            cityId: 'koraput',
            sector: 'environment',
            location: 'Upper Kolab Dam Catchment Area, Koraput',
            projectType: 'State Joint Venture',
            capexInCr: 42.0,
            expectedIrrPercent: 16.2,
            esgRating: 'A',
            status: 'Detailed Project Report',
            directJobs: 620,
            brief: 'Low-impact eco-lodges, solar-powered electric safari catamarans, trekking camps, and an indigenous tribal crafts amphitheater overlooking Kolab lake.',
            highlights: [
                'Single-window eco-tourism clearance from Department of Tourism & Forest Dept.',
                'Zero-discharge green building standard with 100% solar micro-grid powering',
                'Direct benefit-sharing agreement with adjoining indigenous settlements'
            ]
        },
        {
            id: 'proj-kp-03',
            title: 'Decentralized Solar Cold Chain Network for Fresh Horticultural Produce',
            cityId: 'koraput',
            sector: 'infrastructure',
            location: 'Distributed across 8 Koraput Blocks (Semiliguda, Kundura, Pottangi, etc.)',
            projectType: 'Private Sector',
            capexInCr: 34.5,
            expectedIrrPercent: 19.8,
            esgRating: 'A+',
            status: 'Expression of Interest',
            directJobs: 480,
            brief: 'A network of 14 modular, thermal-storage 10-MT solar cold rooms preventing distress sales of seasonal ginger, sweet potatoes, organic vegetables, and pineapples.',
            highlights: [
                'Pre-vetted DMF infrastructure grants supporting 40% civil works cost',
                'High ROI driven by seasonal price arbitrage in Raipur and Bhubaneswar markets',
                'IoT temperature and humidity sensors linked to central telemetry cloud'
            ]
        },
        {
            id: 'proj-kp-04',
            title: 'Jeypore Bamboo & Natural Agro-Fiber Bio-Packaging Plant',
            cityId: 'koraput',
            sector: 'employment',
            location: 'Jeypore Industrial Area',
            projectType: 'PPP',
            capexInCr: 28.0,
            expectedIrrPercent: 17.4,
            esgRating: 'A+',
            status: 'Tendering Active',
            directJobs: 540,
            brief: 'Manufacturing biodegradable food containers, tableware, and protective packaging utilizing locally cultivated bamboo and agro-pulp residues.',
            highlights: [
                'Surging global demand for single-use plastic alternatives',
                'Subsidized raw material procurement quotas from Odisha Forest Development Corp',
                'Green industrial tariff concessions for first 5 years'
            ]
        }
    ],
    bhubaneswar: [
        {
            id: 'proj-bbsr-01',
            title: 'Infocity-2 Semiconductor Compound & Cleanroom Support Campus',
            cityId: 'bhubaneswar',
            sector: 'employment',
            location: 'Infovalley Corridor, Khordha-Bhubaneswar',
            projectType: 'PPP',
            capexInCr: 240.0,
            expectedIrrPercent: 21.0,
            esgRating: 'A',
            status: 'Land Bank Allocated',
            directJobs: 3200,
            brief: 'Specialized utility and testing park equipped with ultra-pure gas supply, cleanroom facilities, and advanced vibration-isolated labs for semiconductor design and OSAT packaging units.',
            highlights: [
                'Supported under Odisha Semiconductor Policy 2023 with 25% additional state incentive',
                'Proximity to IIT Bhubaneswar and IIIT research talents',
                '24x7 redundant power ring feed from 220kV Chandaka grid station'
            ]
        },
        {
            id: 'proj-bbsr-02',
            title: 'Integrated Electric Bus Transit Depots & Mega Fast-Charging Hubs',
            cityId: 'bhubaneswar',
            sector: 'infrastructure',
            location: 'Patia, Rasulgarh, and Pokhariput Interchanges',
            projectType: 'PPP',
            capexInCr: 95.0,
            expectedIrrPercent: 15.8,
            esgRating: 'A+',
            status: 'Tendering Active',
            directJobs: 410,
            brief: 'Development of 3 ultra-modern EV bus depots with automated robotic battery swapping, roof-top solar arrays (3.5 MW combined), and commercial convenience complexes.',
            highlights: [
                'Guaranteed minimum base payment concession model with CRUT (Capital Region Urban Transport)',
                'Ancillary retail and advertising monetization rights included for 20 years',
                'Fast 240 kW CCS-2 chargers accessible to commercial fleet operators overnight'
            ]
        },
        {
            id: 'proj-bbsr-03',
            title: 'Automated Construction & Demolition (C&D) Green Recycling Facility',
            cityId: 'bhubaneswar',
            sector: 'environment',
            location: 'Bhubaneswar Industrial Ring (Mancheswar Outskirts)',
            projectType: 'PPP',
            capexInCr: 58.0,
            expectedIrrPercent: 18.2,
            esgRating: 'A+',
            status: 'Detailed Project Report',
            directJobs: 360,
            brief: 'A 500-tons-per-day automated processing plant transforming urban demolition debris into certified eco-friendly pavers, aggregates, and pre-cast stormwater drainage slabs.',
            highlights: [
                'Mandatory 20% C&D recycled material procurement mandate under BMC building bylaws',
                'Concession includes designated municipal transfer stations across the city',
                'Reduces municipal landfill burden by 180,000 tons annually'
            ]
        }
    ]
};
}),
"[project]/data/recommendations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POLICY_RECOMMENDATIONS",
    ()=>POLICY_RECOMMENDATIONS
]);
const POLICY_RECOMMENDATIONS = [
    {
        id: 'rec-01',
        title: 'Solar-Powered Mobile Telemedicine & Emergency Transit Grid',
        cityId: 'koraput',
        sector: 'healthcare',
        priority: 'Immediate',
        objective: 'Bridge the acute 36.4-point healthcare access deficit by deploying 24 off-road mobile diagnostic vans connected to SLN Medical College Koraput via ISRO/satellite broadband.',
        estimatedBudgetCr: 32.0,
        fundingMechanism: 'District Mineral Foundation (DMF) + State NHM Allocation (60:40)',
        timeToImplementMonths: 9,
        impactScore: 92,
        feasibilityScore: 88,
        keyStakeholders: [
            'government',
            'ngo',
            'citizen'
        ],
        expectedOutcomes: [
            'Expand weekly specialized doctor consultations to 180+ remote tribal habitations',
            'Reduce maternal referral delays by 42% through on-board fetal monitoring',
            'Deliver real-time electronic health records (ABHA IDs) to 250,000 rural citizens'
        ],
        kpiImpact: [
            {
                kpi: 'Healthcare Access Index',
                delta: '+8.4 pts in 18 months'
            },
            {
                kpi: 'Institutional Delivery Rate',
                delta: 'Increase from 79% to 92%'
            }
        ]
    },
    {
        id: 'rec-02',
        title: 'GI Koraput Coffee & Millet Agro-Processing Industrial Cluster',
        cityId: 'koraput',
        sector: 'employment',
        priority: 'Strategic',
        objective: 'Transform subsistence tribal agriculture into high-margin export commodities by creating common curing, packaging, and cold-storage facilities near Jeypore Highway Corridor.',
        estimatedBudgetCr: 65.0,
        fundingMechanism: 'OMBADC (Odisha Mineral Bearing Areas) + PPP Private Concessionaire',
        timeToImplementMonths: 18,
        impactScore: 95,
        feasibilityScore: 82,
        keyStakeholders: [
            'investor',
            'business',
            'government'
        ],
        expectedOutcomes: [
            'Establish 12 FPO-operated micro-curing stations and 1 central vacuum freeze-drying facility',
            'Raise tribal coffee growers farmgate income by 35-40%',
            'Create 3,500 direct and 8,000 indirect non-agricultural livelihoods'
        ],
        kpiImpact: [
            {
                kpi: 'Employment & Livelihood Index',
                delta: '+6.2 pts'
            },
            {
                kpi: 'Formal Non-Farm Jobs',
                delta: '+4,200 jobs by 2027'
            }
        ]
    },
    {
        id: 'rec-03',
        title: 'Digital High School STEM Acceleration & Tribal Vernacular Mentorship',
        cityId: 'koraput',
        sector: 'education',
        priority: 'Medium Term',
        objective: 'Upgrade 45 Model Secondary Schools with interactive virtual science labs and multi-lingual (Kui, Desia, Odia, English) STEM mentoring modules.',
        estimatedBudgetCr: 18.5,
        fundingMechanism: 'Mo School Abhiyan Corporate CSR + State 5T School Fund',
        timeToImplementMonths: 12,
        impactScore: 89,
        feasibilityScore: 85,
        keyStakeholders: [
            'government',
            'ngo',
            'citizen'
        ],
        expectedOutcomes: [
            'Equip 45 high schools with interactive physics/biology lab kits and solar batteries',
            'Provide monthly living stipends for STEM post-graduate teaching fellows',
            'Raise Class 10 to +2 Science stream continuation rate from 28% to 44%'
        ],
        kpiImpact: [
            {
                kpi: 'Education Quality Index',
                delta: '+7.1 pts'
            },
            {
                kpi: 'Secondary Retention Rate',
                delta: 'Increase to 74%'
            }
        ]
    },
    {
        id: 'rec-04',
        title: 'Solar Micro-Grid Gravity Piped Water Reticulation Program',
        cityId: 'koraput',
        sector: 'infrastructure',
        priority: 'Immediate',
        objective: 'Leverage natural hill contour elevation to provide continuous treated tap water to 220 highland tolas using zero-carbon solar pumping and gravity tanks.',
        estimatedBudgetCr: 44.0,
        fundingMechanism: 'Jal Jeevan Mission (Central-State 50:50) + DMF Grant',
        timeToImplementMonths: 14,
        impactScore: 91,
        feasibilityScore: 86,
        keyStakeholders: [
            'government',
            'citizen',
            'ngo'
        ],
        expectedOutcomes: [
            'Construct 85 community gravity storage reservoirs on elevated ridge-lines',
            'Eliminate diesel generator fuel dependencies for water pumping',
            'Train 400 women Self-Help Group members as certified water quality testers (Jal Sathis)'
        ],
        kpiImpact: [
            {
                kpi: 'Physical & Digital Infra Index',
                delta: '+5.5 pts'
            },
            {
                kpi: 'Piped Water Household Ratio',
                delta: 'Reach 65% in Koraput by 2027'
            }
        ]
    },
    {
        id: 'rec-05',
        title: 'Adaptive AI Urban Flood Mitigation & Sponge Retention Basin Network',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        priority: 'Immediate',
        objective: 'Integrate smart ultrasonic water-level sensors across 10 primary storm drains connected to the Bhubaneswar Operations Centre (BOC) and rejuvenate 6 natural detention reservoirs.',
        estimatedBudgetCr: 88.0,
        fundingMechanism: 'Smart Cities Mission + AMRUT 2.0 Resilience Fund',
        timeToImplementMonths: 15,
        impactScore: 94,
        feasibilityScore: 89,
        keyStakeholders: [
            'government',
            'citizen',
            'business'
        ],
        expectedOutcomes: [
            'Eliminate seasonal inundation across 14 vulnerable municipal intersections',
            'Recharge over 3.2 million cubic meters of urban groundwater annually',
            'Provide automated 30-minute advance flash flood alerts to citizen mobile apps'
        ],
        kpiImpact: [
            {
                kpi: 'Physical & Digital Infra Index',
                delta: '+2.8 pts'
            },
            {
                kpi: 'Disaster Resilience Score',
                delta: '+14 pts'
            }
        ]
    },
    {
        id: 'rec-06',
        title: 'Zero-Emission Multimodal Micro-Mobility Feeder Fleet (Mo E-Ride 2.0)',
        cityId: 'bhubaneswar',
        sector: 'infrastructure',
        priority: 'Medium Term',
        objective: 'Deploy 600 electric feeder shuttles connecting Patia IT corridors and residential peripheral wards directly to upcoming Bhubaneswar Metro Line 1 stations.',
        estimatedBudgetCr: 45.0,
        fundingMechanism: 'CRUT (Capital Region Urban Transport) PPP Scheme',
        timeToImplementMonths: 10,
        impactScore: 87,
        feasibilityScore: 93,
        keyStakeholders: [
            'business',
            'citizen',
            'investor',
            'government'
        ],
        expectedOutcomes: [
            'Cut peak corridor commuting times by 20-25%',
            'Reduce localized PM2.5 tailpipe emissions by 1,800 MT annually',
            'Achieve 98% unified digital smart card / QR transit ticketing integration'
        ],
        kpiImpact: [
            {
                kpi: 'Public Transit Mode Share',
                delta: 'Increase to 46%'
            },
            {
                kpi: 'Carbon Intensity per Passenger-Km',
                delta: '-32%'
            }
        ]
    }
];
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatNumber",
    ()=>formatNumber,
    "formatPercent",
    ()=>formatPercent,
    "formatScore",
    ()=>formatScore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatNumber(num, options) {
    return new Intl.NumberFormat("en-IN", options).format(num);
}
function formatPercent(value) {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
function formatScore(score) {
    return score.toFixed(1);
}
}),
]})(),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07ywj3fge9de9._.js.map