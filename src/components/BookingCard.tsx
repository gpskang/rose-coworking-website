"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { SendOtp, RegisterCoworking, InitiateCoworkingPayment } from "@/apis/api.services";
import { extractOtp } from "@/lib/otp";

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type Step = "phone" | "otp" | "form";

export default function BookingCard() {
    const [step, setStep] = useState<Step>("phone");
    const [seconds, setSeconds] = useState(0);
    const [phone, setPhone] = useState("");
    const stylistNameRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otp, setOtp] = useState("");
    const [form, setForm] = useState({ name: "", email: "", gender: "", city: "", address: "", terms: false });
    const [otpToken, setOtpToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    function verifyOtp() {
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
        setStep("form");
        setTimeout(() => stylistNameRef.current?.focus(), 0);
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border p-4 sm:p-6 w-full ">
            <h3 className=" !text-[24px]  !font-semibold text-slate-900 mb-4">Join RoSe Co-Working</h3>

            {step === "phone" && (
                <form className="" onSubmit={(e) => e.preventDefault()}>
                    {/* <Label className="text-xs text-slate-600">Phone Number</Label> */}
                    <div className="flex gap-2 mb-1 ">
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
                    </div>
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    <div className="mt-4"></div>
                    <Button type="button" disabled={loading} onClick={sendOtp} className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">
                        {loading ? "Sending..." : "Get OTP"}
                    </Button>
                </form>
            )}

            {step === "otp" && (
                <form className="!space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {/* <Label className="text-xs text-slate-600">Phone Number</Label> */}
                    <div className="flex gap-3 ">
                        <span className="flex items-center rounded-lg bg-slate-100 border border-r-0 px-3 text-sm text-slate-700">+91</span>
                        <Input disabled value={phone} className="h-10 w-full rounded-r-lg bg-slate-100 border text-sm text-slate-500" />
                    </div>
                    <Separator className=" !my-6 " />
                    <div className="">
                        <InputOTP value={otp} onChange={(val) => { setOtp(val); if (errors.otp) clearError("otp"); }} maxLength={6} className="gap-2">
                            <InputOTPGroup className="  flex !w-full justify-between " >
                                <InputOTPSlot index={0} className="h-12 w-12 rounded-md bg-slate-100" />
                                <InputOTPSlot index={1} className="h-12 w-12 rounded-md bg-slate-100" />
                                <InputOTPSlot index={2} className="h-12 w-12 rounded-md bg-slate-100" />
                                <InputOTPSlot index={3} className="h-12 w-12 rounded-md bg-slate-100" />
                                <InputOTPSlot index={4} className="h-12 w-12 rounded-md bg-slate-100" />
                                <InputOTPSlot index={5} className="h-12 w-12 rounded-md bg-slate-100" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {errors.otp && <p className="text-xs text-red-600 text-center">{errors.otp}</p>}
                    <div className=" w-full flex justify-end">
                        <p className="text-xs text-slate-600">
                            Did not receive code yet? {seconds > 0 ? (
                                <span>Re-send in 0:{String(seconds).padStart(2, "0")}</span>
                            ) : (
                                <button type="button" onClick={sendOtp} className="text-teal-700 font-medium hover:underline">Re-send</button>
                            )}
                        </p>
                    </div>
                    <Button type="button" onClick={verifyOtp} className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">Submit</Button>
                </form>
            )}

            {step === "form" && (
                <form
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
                                    amount: 1,
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
                    <div className="">
                        <Input
                            ref={stylistNameRef as any}
                            value={form.name}
                            onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) clearError("name"); }}
                            placeholder="Stylist Name"
                            className="h-10 bg-slate-100"
                        />
                        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div className="">
                        <Input
                            value={form.email}
                            onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) clearError("email"); }}
                            placeholder="Email (optional)"
                            className="h-10 bg-slate-100"
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div className="flex gap-3 ">
                        <span className="flex items-center rounded-lg bg-slate-100 border border-r-0 px-3 text-sm text-slate-700">+91</span>
                        <Input disabled value={phone} className="h-10 w-full rounded-r-lg bg-slate-100 border text-sm text-slate-500" />
                    </div>
                    <div className="">
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
                        {errors.gender && <p className="text-xs text-red-600">{errors.gender}</p>}
                    </div>
                    <div className="">
                        <Input value={form.city} onChange={(e) => { setForm({ ...form, city: e.target.value }); if (errors.city) clearError("city"); }} placeholder="Enter City Name" className="h-10 bg-slate-100" />
                        {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                    </div>
                    <div className="">
                        <Input value={form.address} onChange={(e) => { setForm({ ...form, address: e.target.value }); if (errors.address) clearError("address"); }} placeholder="Address" className="h-10 bg-slate-100" />
                        {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
                    </div>
                    <div className="">
                        <label className="flex items-center  !gap-3 text-sm select-none">
                            <input type="checkbox" checked={form.terms} onChange={(e) => { setForm({ ...form, terms: e.target.checked }); if (errors.terms && e.target.checked) clearError("terms"); }} className="h-4 w-4 rounded border" />
                            <span className="text-sm !ml-2">I accept <Link href="/(website)/term-condition" className="text-teal-700 underline">terms & conditions</Link></span>
                        </label>
                        {errors.terms && <p className="text-xs text-red-600">{errors.terms}</p>}
                    </div>
                    {errors.submit && <p className="text-xs text-red-600">{errors.submit}</p>}
                    <Button type="submit" className="w-full h-10 !rounded-md bg-teal-600 hover:bg-teal-700">Submit & Pay</Button>
                </form>
            )}
        </div>
    );
}


