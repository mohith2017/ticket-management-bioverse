import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const formSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  desc: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Form() {
  const [result, setResult] = useState<string>();
  const [resultColor, setResultColor] = useState<string>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const processForm = async (data: FormData) => {
    const token = await recaptchaRef?.current?.executeAsync();
    recaptchaRef?.current?.reset();
    // @ts-ignore-next-line
    data["token"] = token || "";
    const config = {
      method: "post",
      url: "/api/form",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    
    try {
      const response = await axios(config);
      if (response.status === 200) {
        setResult(
          "Your ticket has been sent. Thank you for contacting Bioverse. We will get back to you as soon as possible!"
        );
        setResultColor("text-green-500");
        reset();
      }
    } catch (err: any) {
      setResult(err.response.data.message + ": " + err.response.statusText);
      setResultColor("text-red-500");
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(processForm)} noValidate>
      <div className="mb-4">
        <div className="relative">
          {errors.name?.message ? (
            <FaUser className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2 border-r pr-2 text-red-500" />
          ) : (
            <FaUser className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2 border-r pr-2" />
          )}
          <input
            className={`shadow appearance-none outline border rounded w-full py-2 pl-10 text-gray-700 leading-tight duration-300
          ${errors.name?.message && "shadow-[0_0_0_2px] shadow-red-500"}
          `}
            type="text"
            placeholder="Full name"
            {...register("name")}
          />
        </div>
        {errors.name?.message && (
          <div className="text-red-500 text-xs mt-1">
            {errors.name?.message}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="relative">
          {errors.email?.message ? (
            <IoMdMail className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2 border-r pr-2 text-red-500" />
          ) : (
            <IoMdMail className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2 border-r pr-2" />
          )}
          <input
            className={`shadow appearance-none outline border rounded w-full py-2 pl-10 text-gray-700  leading-tight duration-300
          ${errors.email?.message && "shadow-[0_0_0_2px] shadow-red-500"}
          `}
            type="email"
            placeholder="Email"
            {...register("email")}
          />
        </div>
        {errors.email?.message && (
          <div className="text-red-500 text-xs mt-1">
            {errors.email?.message}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <textarea
          className={`shadow appearance-none outline border rounded w-full py-2 px-3 text-gray-700 leading-tight duration-300
          ${errors.desc?.message && "shadow-[0_0_0_2px] shadow-red-500"}
          `}
          placeholder="Description"
          rows={5}
          {...register("desc")}
        ></textarea>
        {errors.desc?.message && (
          <div className="text-red-500 text-xs mt-1">
            {errors.desc?.message}
          </div>
        )}
      </div>

      <div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          size="invisible"
          ref={recaptchaRef}
          hl="en"
        />
      </div>

      <div className="flex gap-10 items-center justify-between">
        <button
          className={`${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          } bg-white hover:bg-gray-400 text-black font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline duration-300`}
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit(processForm)}
        >
          {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
        </button>

        {isSubmitSuccessful && (
          <div className={`text-right ${resultColor}`}>{result}</div>
        )}
      </div>
    </form>
  );
}
