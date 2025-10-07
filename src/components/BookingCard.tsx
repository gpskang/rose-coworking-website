"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { SendOtp, RegisterCoworking, InitiateCoworkingPayment, FindRegisteredPaidUser, GetSystemConfig } from "@/apis/api.services";
import { extractOtp } from "@/lib/otp";



type Step = "phone" | "otp" | "form";

export default function BookingCard() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("phone");
    const [seconds, setSeconds] = useState(0);
    const [phone, setPhone] = useState("");
    const stylistNameRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otp, setOtp] = useState("");
    const [form, setForm] = useState({ name: "", email: "", gender: "", city: "", address: "", terms: false });
    const [otpToken, setOtpToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [registrationFee, setRegistrationFee] = useState<number>(5000); // Default fallback

    // Fetch registration fee on component mount
    useEffect(() => {
        const fetchRegistrationFee = async () => {
            try {
                const response = await GetSystemConfig('co_working_registration_fee');
                if (response?.data?.data?.value) {
                    const fee = parseInt(response.data.data.value);
                    setRegistrationFee(fee);
                }
            } catch (error) {
                console.log('Failed to fetch registration fee, using default:', error);
                // Keep default value
            }
        };

        fetchRegistrationFee();
    }, []);

    function clearError(key: string) {
        setErrors((prev) => {
            if (!(key in prev)) return prev;
            const { [key]: _omit, ...rest } = prev;
            return rest;
        });
    }

    function startOtpTimer() {
        setSeconds(30);
        const timer = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }

    async function sendOtp() {
        const PhoneSchema = z
            .string()
            .trim()
            .refine((v) => v && v.replace(/\D/g, "").length === 10, "Enter a valid 10-digit phone number");
        const result = PhoneSchema.safeParse(phone);
        if (!result.success) {
            setErrors({ phone: result.error.issues[0].message });
            return;
        }
        try {
            setErrors({});
            setLoading(true);
            const res = await SendOtp({ phone: `+91${phone}`, channel: "sms" });
            const tokenFromApi = res?.data?.data?.token;
            if (!tokenFromApi) {
                throw new Error("OTP token missing in response");
            }
            setOtpToken(tokenFromApi);
            setOtp("");
            setStep("otp");
            startOtpTimer();
        } catch (e: any) {
            setErrors({ phone: e?.response?.data?.message || e?.message || "Failed to send OTP" });
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp() {
        const OtpSchema = z
            .string()
            .length(6, "Enter 6-digit code")
            .regex(/^\d{6}$/, "Only digits allowed");
        const res = OtpSchema.safeParse(otp);
        if (!res.success) {
            setErrors({ otp: res.error.issues[0].message });
            return;
        }
        if (!otpToken) {
            setErrors({ otp: "Please request a new OTP" });
            return;
        }
        try {
            const expected = extractOtp(otpToken);
            if (otp !== expected) {
                setErrors({ otp: "Incorrect code" });
                return;
            }
        } catch (e: any) {
            setErrors({ otp: e?.message || "Could not verify code" });
            return;
        }
        
        setErrors({});
        setLoading(true);
        
        try {
            // Check if user is already registered and paid
            const response = await FindRegisteredPaidUser({ phone });
            const data = response?.data?.data;
            
            if (response?.status === 200 && data && (data.status === 'success' || data.isPaid === true)) {
                // User is already registered and paid, redirect to phone route
                router.push(`/${phone}`);
                return;
            }
        } catch (error: any) {
            // If API returns 400 or user not found, continue with registration flow
            console.log("User not found or not paid, continuing with registration flow");
        } finally {
            setLoading(false);
        }
        
        // Continue with current flow (registration form)
        setStep("form");
        setTimeout(() => stylistNameRef.current?.focus(), 0);
    }

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border p-4 sm:p-6 w-full max-w-sm mx-auto sm:max-w-none sm:mx-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.h3 
                className="!text-[24px] !font-semibold text-slate-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                Join RoSe Co-Working
            </motion.h3>

            <AnimatePresence mode="wait">
                {step === "phone" && (
                    <motion.form 
                        key="phone-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className=""
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <motion.div 
                            className="flex gap-2 mb-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <span className="flex items-center rounded-lg bg-slate-100 border border-r-0 px-3 text-sm text-slate-700">+91</span>
                            <Input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setPhone(digits);
                                    if (errors.phone) clearError("phone");
                                }}
                                placeholder="Phone Number"
                                className="h-10 w-full rounded-r-lg bg-slate-100 border text-sm placeholder:text-slate-400"
                            />
                        </motion.div>
                        <AnimatePresence>
                            {errors.phone && (
                                <motion.p 
                                    key="phone-error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-red-600"
                                >
                                    {errors.phone}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <div className="mt-4"></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <Button type="button" disabled={loading} onClick={sendOtp} className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">
                                {loading ? "Sending..." : "Get OTP"}
                            </Button>
                        </motion.div>
                    </motion.form>
                )}

                {step === "otp" && (
                    <motion.form 
                        key="otp-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="!space-y-4" 
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <motion.div 
                            className="flex gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <span className="flex items-center rounded-lg bg-slate-100 border border-r-0 px-3 text-sm text-slate-700">+91</span>
                            <Input disabled value={phone} className="h-10 w-full rounded-r-lg bg-slate-100 border text-sm text-slate-500" />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <Separator className="!my-6" />
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <InputOTP value={otp} onChange={(val) => { setOtp(val); if (errors.otp) clearError("otp"); }} maxLength={6} className="gap-2">
                                <InputOTPGroup className="flex !w-full justify-between">
                                    <InputOTPSlot index={0} className="h-12 w-12 rounded-md bg-slate-100" />
                                    <InputOTPSlot index={1} className="h-12 w-12 rounded-md bg-slate-100" />
                                    <InputOTPSlot index={2} className="h-12 w-12 rounded-md bg-slate-100" />
                                    <InputOTPSlot index={3} className="h-12 w-12 rounded-md bg-slate-100" />
                                    <InputOTPSlot index={4} className="h-12 w-12 rounded-md bg-slate-100" />
                                    <InputOTPSlot index={5} className="h-12 w-12 rounded-md bg-slate-100" />
                                </InputOTPGroup>
                            </InputOTP>
                        </motion.div>
                        
                        <AnimatePresence>
                            {errors.otp && (
                                <motion.p 
                                    key="otp-error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-red-600 text-center"
                                >
                                    {errors.otp}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        
                        <motion.div 
                            className="w-full flex justify-end"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <p className="text-xs text-slate-600">
                                Did not receive code yet? {seconds > 0 ? (
                                    <span>Re-send in 0:{String(seconds).padStart(2, "0")}</span>
                                ) : (
                                    <button type="button" onClick={sendOtp} className="text-teal-700 font-medium hover:underline">Re-send</button>
                                )}
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <Button type="button" disabled={loading} onClick={verifyOtp} className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">
                                {loading ? "Verifying..." : "Submit"}
                            </Button>
                        </motion.div>
                    </motion.form>
                )}

                {step === "form" && (
                    <motion.form
                        key="form-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="!space-y-3"
                        onSubmit={(e) => {
                        e.preventDefault();
                        const FormSchema = z.object({
                            name: z.string().trim().min(2, "Enter a valid name"),
                            email: z.string().trim().email("Enter valid email").optional().or(z.literal("")),
                            gender: z.string().refine((v) => ["Female", "Male", "Other"].includes(v), "Select gender"),
                            city: z.string().trim().min(2, "Enter city"),
                            address: z.string().trim().min(5, "Enter address"),
                            terms: z.literal(true, { message: "Please accept terms" }),
                        });
                        const parsed = FormSchema.safeParse(form);
                        if (!parsed.success) {
                            const errs: Record<string, string> = {};
                            parsed.error.issues.forEach((e) => { if (e.path[0]) errs[String(e.path[0])] = e.message; });
                            setErrors(errs);
                            return;
                        }
                        setErrors({});
                        const payload = {
                            name: form.name,
                            phone: phone,
                            gender: form.gender.toLowerCase(),
                            city: form.city,
                            address: form.address,
                            termsAccepted: form.terms,
                            email: form.email || undefined,
                        };
                        (async () => {
                            try {
                                setLoading(true);
                                const regRes = await RegisterCoworking(payload);
                                const regData = regRes?.data;
                                const userId = regData?.data?.user._id;
                                if (!userId) throw new Error("Missing userId from registration");

                                const payRes = await InitiateCoworkingPayment({
                                    userId,
                                    amount: registrationFee,
                                    name: regData?.data?.user.name,
                                    email: regData?.data?.user.email || undefined,
                                    phone: regData?.data?.user.phone,
                                });
                                const payment = payRes?.data?.data;
                                const redirectForm = payment?.redirectForm;
                                if (redirectForm) {
                                    const w = window.open('', '_blank');
                                    if (w) {
                                        w.document.open();
                                        w.document.write(redirectForm);
                                        w.document.close();
                                    } else {
                                        throw new Error("Popup blocked. Please allow popups and try again.");
                                    }
                                } else {
                                    throw new Error("Failed to initiate payment");
                                }
                            } catch (e: any) {
                                setErrors({ submit: e?.response?.data?.message || e?.message || "Failed to submit" });
                            } finally {
                                setLoading(false);
                            }
                        })();
                    }}
                    >
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <Input
                                ref={stylistNameRef as any}
                                value={form.name}
                                onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) clearError("name"); }}
                                placeholder="Stylist Name"
                                className="h-10 bg-slate-100"
                            />
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p 
                                        key="name-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <Input
                                value={form.email}
                                onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) clearError("email"); }}
                                placeholder="Email (optional)"
                                className="h-10 bg-slate-100"
                            />
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p 
                                        key="email-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <motion.div 
                            className="flex gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <span className="flex items-center rounded-lg bg-slate-100 border border-r-0 px-3 text-sm text-slate-700">+91</span>
                            <Input disabled value={phone} className="h-10 w-full rounded-r-lg bg-slate-100 border text-sm text-slate-500" />
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <select
                                value={form.gender}
                                onChange={(e) => { setForm({ ...form, gender: e.target.value }); if (errors.gender) clearError("gender"); }}
                                className="h-10 w-full rounded-md bg-slate-100 border px-3 text-sm"
                            >
                                <option value="">Select Gender</option>
                                <option>Female</option>
                                <option>Male</option>
                                <option>Other</option>
                            </select>
                            <AnimatePresence>
                                {errors.gender && (
                                    <motion.p 
                                        key="gender-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.gender}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <Input value={form.city} onChange={(e) => { setForm({ ...form, city: e.target.value }); if (errors.city) clearError("city"); }} placeholder="Enter City Name" className="h-10 bg-slate-100" />
                            <AnimatePresence>
                                {errors.city && (
                                    <motion.p 
                                        key="city-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.city}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <Input value={form.address} onChange={(e) => { setForm({ ...form, address: e.target.value }); if (errors.address) clearError("address"); }} placeholder="Address" className="h-10 bg-slate-100" />
                            <AnimatePresence>
                                {errors.address && (
                                    <motion.p 
                                        key="address-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.address}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <motion.div 
                            className=""
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                        >
                            <label className="flex items-center !gap-3 text-sm select-none">
                                <input type="checkbox" checked={form.terms} onChange={(e) => { setForm({ ...form, terms: e.target.checked }); if (errors.terms && e.target.checked) clearError("terms"); }} className="h-4 w-4 rounded border" />
                                <span className="text-sm !ml-2">I accept <Link href="/(website)/term-condition" className="text-teal-700 underline">terms & conditions</Link></span>
                            </label>
                            <AnimatePresence>
                                {errors.terms && (
                                    <motion.p 
                                        key="terms-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-red-600"
                                    >
                                        {errors.terms}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <AnimatePresence>
                            {errors.submit && (
                                <motion.p 
                                    key="submit-error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-red-600"
                                >
                                    {errors.submit}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        
                        <motion.div 
                            className="p-3 bg-teal-50 rounded-lg border border-teal-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-teal-900">Registration Fee:</span>
                                <span className="text-lg font-bold text-teal-700">₹{registrationFee.toLocaleString()}</span>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            <Button type="submit" className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">
                                Submit & Pay ₹{registrationFee.toLocaleString()}
                            </Button>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


