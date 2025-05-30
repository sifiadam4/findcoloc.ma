"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Upload,
  Camera,
  Shield,
  ChevronLeft,
  ChevronRight,
  FileImage,
  AlertCircle,
  Check,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  idType: z.enum(["id_card", "passport"], {
    required_error: "Please select an ID type",
  }),
  frontImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  backImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  selfieImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export function VerificationStep({
  data,
  updateData,
  onSubmit,
  onPrevious,
  isLoading,
}) {
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idType: data.idType || "",
      frontImage: null,
      backImage: null,
      selfieImage: null,
    },
  });

  const watchIdType = form.watch("idType");

  // Update wizard data when idType changes
  useEffect(() => {
    if (watchIdType && watchIdType !== data.idType) {
      updateData({ idType: watchIdType });
    }
  }, [watchIdType, data.idType, updateData]);

  const handleImageChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (values) => {
    try {
      setSubmitError(null); // Clear any previous errors

      console.log("Form values submitted:", values);
      console.log("Preview states:", {
        frontPreview: frontPreview ? "has data" : "no data",
        backPreview: backPreview ? "has data" : "no data",
        selfiePreview: selfiePreview ? "has data" : "no data",
      });

      // Validate that we have the ID type and at least the required images
      if (!values.idType) {
        throw new Error("Please select an ID type");
      }

      if (!frontPreview || !backPreview || !selfiePreview) {
        throw new Error(
          "Please upload all required images (front, back, and selfie)"
        );
      }

      // Prepare the final data with verification documents
      const verificationData = {
        idType: values.idType,
        frontImage: frontPreview,
        backImage: backPreview,
        selfieImage: selfiePreview,
      };

      console.log("Processed data for submission:", {
        ...verificationData,
        frontImage: verificationData.frontImage
          ? "base64 data present"
          : "no data",
        backImage: verificationData.backImage
          ? "base64 data present"
          : "no data",
        selfieImage: verificationData.selfieImage
          ? "base64 data present"
          : "no data",
      });

      // Update the wizard data with all the processed data
      updateData(verificationData);

      // Call onSubmit with the verification data to ensure it's available immediately
      onSubmit(verificationData);
    } catch (error) {
      console.error("Error processing files:", error);
      setSubmitError(error.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Identity Verification</h3>
            <p className="text-muted-foreground text-sm">
              To ensure a safe community, we need to verify your identity
            </p>
          </div>
          <FormField
            control={form.control}
            name="idType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select ID Type*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {" "}
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="id_card"
                          id="id_card"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <label
                        htmlFor="id_card"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                          watchIdType === "id_card" ? "bg-accent" : ""
                        )}
                      >
                        <FileImage className="mb-3 h-6 w-6" />
                        <div className="text-center space-y-1">
                          <p className="font-medium">National ID Card</p>
                          <p className="text-sm text-muted-foreground">
                            Use your national identity card
                          </p>
                        </div>
                      </label>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="passport"
                          id="passport"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <label
                        htmlFor="passport"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                          watchIdType === "passport" ? "bg-accent" : ""
                        )}
                      >
                        <FileImage className="mb-3 h-6 w-6" />
                        <div className="text-center space-y-1">
                          <p className="font-medium">Passport</p>
                          <p className="text-sm text-muted-foreground">
                            Use your passport for verification
                          </p>
                        </div>
                      </label>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchIdType && (
            <div className="space-y-6 mt-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {" "}
                <FormField
                  control={form.control}
                  name="frontImage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>
                        {watchIdType === "id_card"
                          ? "Front of ID Card*"
                          : "Front of Passport*"}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Card className="overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                              {frontPreview ? (
                                <img
                                  src={frontPreview}
                                  alt="ID Front Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                                  <Upload className="h-10 w-10 mb-2" />
                                  <p className="text-sm">
                                    {watchIdType === "id_card"
                                      ? "Upload the front side of your ID card"
                                      : "Upload the main page of your passport"}
                                  </p>
                                </div>
                              )}
                            </div>
                            <CardFooter className="p-4">
                              <label
                                htmlFor="front-image-upload"
                                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium w-full"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {frontPreview ? "Change Image" : "Upload Image"}
                                <input
                                  id="front-image-upload"
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleImageChange(e, setFrontPreview);
                                    onChange(e.target.files?.[0] || null);
                                  }}
                                  {...rest}
                                />
                              </label>
                            </CardFooter>
                          </Card>
                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="backImage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>
                        {watchIdType === "id_card"
                          ? "Back of ID Card*"
                          : "Additional Passport Page*"}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Card className="overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                              {backPreview ? (
                                <img
                                  src={backPreview}
                                  alt="ID Back Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                                  <Upload className="h-10 w-10 mb-2" />
                                  <p className="text-sm">
                                    {watchIdType === "id_card"
                                      ? "Upload the back side of your ID card"
                                      : "Upload the visa/information page"}
                                  </p>
                                </div>
                              )}
                            </div>
                            <CardFooter className="p-4">
                              <label
                                htmlFor="back-image-upload"
                                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium w-full"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {backPreview ? "Change Image" : "Upload Image"}
                                <input
                                  id="back-image-upload"
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleImageChange(e, setBackPreview);
                                    onChange(e.target.files?.[0] || null);
                                  }}
                                  {...rest}
                                />
                              </label>
                            </CardFooter>
                          </Card>
                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="selfieImage"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="max-w-md mx-auto">
                    <FormLabel>Selfie with ID*</FormLabel>
                    <FormDescription className="text-center">
                      Take a photo of yourself holding your ID document
                    </FormDescription>
                    <FormControl>
                      <div className="space-y-4">
                        <Card className="overflow-hidden">
                          <div className="aspect-square bg-muted relative">
                            {selfiePreview ? (
                              <img
                                src={selfiePreview}
                                alt="Selfie Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                                <Camera className="h-10 w-10 mb-2" />
                                <p className="text-sm">
                                  Take a selfie while holding your ID clearly
                                  visible
                                </p>
                              </div>
                            )}
                          </div>
                          <CardFooter className="p-4">
                            <label
                              htmlFor="selfie-image-upload"
                              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium w-full"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              {selfiePreview ? "Change Selfie" : "Take Selfie"}
                              <input
                                id="selfie-image-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                capture="user"
                                className="hidden"
                                onChange={(e) => {
                                  handleImageChange(e, setSelfiePreview);
                                  onChange(e.target.files?.[0] || null);
                                }}
                                {...rest}
                              />
                            </label>
                          </CardFooter>
                        </Card>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}{" "}
          <div className="flex items-start mt-8 bg-blue-50 p-4 rounded-lg">
            <Shield className="text-blue-600 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Your identity documents are encrypted and stored securely. They
              will only be used for verification purposes and will not be shared
              with other users.
            </p>
          </div>
          {submitError && (
            <div className="flex items-start mt-4 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="text-red-600 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <Separator className="" />
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Complete Profile
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
