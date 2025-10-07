"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FindRegisteredPaidUser } from '@/apis/api.services';
import { CheckCircle, XCircle, User, Phone, Mail, MapPin, Calendar, CreditCard, Loader2 } from 'lucide-react';

interface UserData {
    _id: string;
    userId: string;
    txnid: string;
    amount: number;
    mode: string;
    firstname: string;
    lastname: string;
    status: string;
    gateway: string;
    paymentData: {
        amount: string;
        paymentMode: string;
        customerName: string;
        productInfo: string;
        customerPhone: string;
        customerEmail: string;
        merchantTransactionId: string;
        bankRefNum: string;
        status: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

type PageState = 'loading' | 'success' | 'error' | 'not-found';

const Page = () => {
    const params = useParams();
    const phone = params.phone as string;
    const [pageState, setPageState] = useState<PageState>('loading');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setPageState('loading');
                const response = await FindRegisteredPaidUser({ phone });
                const data = response?.data?.data;

                // Check if payment exists and status is success
                if (data && (data.status === 'success' || data.isPaid === true)) {
                    setUserData(data);
                    setPageState('success');
                } else {
                    setPageState('not-found');
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || err?.message || 'Something went wrong');
                setPageState('error');
            }
        };

        if (phone) {
            fetchUserData();
        }
    }, [phone]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const successVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
    };

    const userCardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-2 sm:p-4 lg:p-6">
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                <AnimatePresence mode="wait">
                    {pageState === 'loading' && (
                        <motion.div
                            key="loading"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 lg:p-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6"
                                >
                                    <Loader2 className="w-full h-full text-teal-600" />
                                </motion.div>
                                <motion.h2
                                    className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 sm:mb-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Checking Payment Status
                                </motion.h2>
                                <motion.p
                                    className="text-sm sm:text-base text-slate-600 px-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Please wait while we verify your payment details...
                                </motion.p>
                            </div>
                        </motion.div>
                    )}
                    
                    {pageState === 'success' && (
                        <motion.div
                            key="success"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            {/* Success Animation */}
                            <motion.div
                                variants={successVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2
                                }}
                                className="text-center mb-6 sm:mb-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                        delay: 0.3
                                    }}
                                    className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                                >
                                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                                </motion.div>
                                <motion.h1
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Congratulations! 🎉
                                </motion.h1>
                                <motion.p
                                    className="text-lg sm:text-xl text-slate-700 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    Payment Verified Successfully
                                </motion.p>
                            </motion.div>

                            {/* User Data Card */}
                            {userData && (
                                <motion.div
                                    variants={userCardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                        delay: 0.6
                                    }}
                                    className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 sm:p-6 text-white">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-6 h-6 sm:w-8 sm:h-8" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{userData.firstname} {userData.lastname}</h2>
                                                <p className="text-teal-100 text-sm sm:text-base">Registered Member</p>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="p-4 sm:p-6"
                                        variants={staggerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{
                                            staggerChildren: 0.1,
                                            delayChildren: 0.8
                                        }}
                                    >
                                        <div className="grid gap-3 sm:gap-4">
                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                            >
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-slate-900 text-sm sm:text-base">Phone</p>
                                                    <p className="text-slate-600 text-sm sm:text-base break-all">+91 {userData.paymentData.customerPhone}</p>
                                                </div>
                                            </motion.div>

                                            {userData.paymentData.customerEmail && (
                                                <motion.div
                                                    variants={itemVariants}
                                                    transition={{ duration: 0.5 }}
                                                    className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                                >
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-slate-900 text-sm sm:text-base">Email</p>
                                                        <p className="text-slate-600 text-sm sm:text-base break-all">{userData.paymentData.customerEmail}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                            >
                                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-slate-900 text-sm sm:text-base">Transaction ID</p>
                                                    <p className="text-slate-600 text-sm sm:text-base break-all">{userData.txnid}</p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                            >
                                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-slate-900 text-sm sm:text-base">Payment Date</p>
                                                    <p className="text-slate-600 text-sm sm:text-base">
                                                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                            >
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                                                    <span className="text-sm sm:text-base font-bold">₹</span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-slate-900 text-sm sm:text-base">Amount Paid</p>
                                                    <p className="text-slate-600 text-sm sm:text-base">₹{userData.amount}</p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg"
                                            >
                                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-slate-900 text-sm sm:text-base">Payment Mode</p>
                                                    <p className="text-slate-600 text-sm sm:text-base">{userData.mode}</p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start sm:items-center space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200"
                                            >
                                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-green-900 text-sm sm:text-base">Payment Status</p>
                                                    <p className="text-green-700 font-semibold text-sm sm:text-base">✅ {userData.status.toUpperCase()} & Active</p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.2 }}
                                        >
                                            <h3 className="font-semibold text-teal-900 mb-2 text-sm sm:text-base">Welcome to RoSe Co-Working! 🚀</h3>
                                            <p className="text-teal-700 text-xs sm:text-sm">
                                            Your membership is now active. You can access all our premium co-working facilities and amenities.
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {pageState === 'not-found' && (
                        <motion.div
                            key="not-found"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 lg:p-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                    className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                                >
                                    <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600" />
                                </motion.div>
                                <motion.h2
                                    className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Data Not Found
                                </motion.h2>
                                <motion.p
                                    className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    No registered paid user found for phone number <span className="font-semibold break-all">+91 {phone}</span>
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200 mx-2 sm:mx-0"
                                >
                                    <p className="text-orange-700 text-xs sm:text-sm">
                                        Please ensure you have completed the registration and payment process.
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {pageState === 'error' && (
                        <motion.div
                            key="error"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-4 sm:p-6 md:p-8 lg:p-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                    className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                                >
                                    <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
                                </motion.div>
                                <motion.h2
                                    className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Something Went Wrong
                                </motion.h2>
                                <motion.p
                                    className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 px-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    {error}
                                </motion.p>
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    onClick={() => window.location.reload()}
                                    className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
                                >
                                    Try Again
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
        </div>
        </main>
    );
};

export default Page;
