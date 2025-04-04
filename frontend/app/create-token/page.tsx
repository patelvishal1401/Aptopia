"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useImgApi from "../../hooks/useImgApi";
import { supabase } from "../../services/supabase";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useNotification } from "@/hooks/useNotification"
import TransactionPopup from "./TransactionPopup"
import { BtnLoader } from "@/components/Loader"
import { Textarea } from "@/components/ui/textarea"


export const init = {
  name: "",
  symbol: "",
  decimals: 6,
  iconUrl: "",
  projectUrl: "",
  mintFee: null,
  initialSupply: "",
  description: "",
};

export default function TokenCreationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(init)
    const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const { connected } = useWallet();
    const { showMessage } = useNotification();
  const [errors, setErrors] = useState({
    name: "",
    symbol: "",
    projectUrl: "",
    iconUrl: '',
    description: "",
    initialSupply: "",
  });

  const [imagePreview, setImagePreview] = useState('')
  const { apiFn ,loading:imgLoading} = useImgApi();

  const handleImageChange = async (event:any) => {
    const file = event.target.files[0];

    const result = await apiFn({
      file: file,
    });
    if (result?.response) {
      setFormData((data:any) => ({ ...data, iconUrl: result.response }));
      setImagePreview(result?.response);
    } else if (result?.error) {
      console.log(result.error);
      return;
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors:any = {};

    if (!formData.name) {
      newErrors.name = "Token name is required";
      valid = false;
    }
    if (!formData.symbol) {
      newErrors.symbol = "Token symbol is required";
      valid = false;
    }

    if (!formData.iconUrl) {
      newErrors.iconUrl = "Image is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };



   const handleSubmit = async (e:any) => {
     e.preventDefault();
     console.log(formData);
     try {
       if (!connected) {
         showMessage({
           type: "error",
           value: "Connect the wallet to create token",
         });
         return;
       }
       if (!validateForm()) return;

       setLoading(true);
       const { data: fetchData, error: fetchDataError } = await supabase
         .from("tokens")
         .select("*")
         .eq("name", formData?.name);
       console.log(fetchData);
       if (fetchDataError) {
         setErrors((errors) => ({
           ...errors,
           name: "Error verifying the token name",
         }));
         setLoading(false);
         return;
       }
       if (fetchData.length) {
         setLoading(false);
         setErrors((errors) => ({
           ...errors,
           name: "Token Name should be unique",
         }));
         return;
       }

       setShowTransactionPopup(true);
     } catch (error) {
       console.log("Error inserting data:", error);
     }
   };

  return (
    <div className='container max-w-2xl mx-auto pt-24 pb-16 px-4'>
      <div className='flex flex-col space-y-8'>
        <div className='flex items-center'>
          <Link
            href='/'
            className='flex items-center text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            <span>GO BACK</span>
          </Link>
        </div>

        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Create Your Token</h1>
          <p className='text-muted-foreground'>
            Fill in the details below to create your custom token
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='tokenName'
              className='text-sm font-medium uppercase'
            >
              Token Name
            </Label>
            <Input
              id='tokenName'
              placeholder='e.g. My Token'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            {errors.name && (
              <p className='text-red-500 text-sm '>{errors.name}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='tokenSymbol'
              className='text-sm font-medium uppercase'
            >
              Token Symbol
            </Label>
            <Input
              id='tokenSymbol'
              placeholder='e.g. MTK'
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='projectUrl'
              className='text-sm font-medium uppercase'
            >
              Project URL
            </Label>
            <Input
              id='projectUrl'
              placeholder='Project Url'
              type='url'
              value={formData.projectUrl}
              onChange={(e) =>
                setFormData({ ...formData, projectUrl: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='tokenImage'
              className='text-sm font-medium uppercase'
            >
              Image
            </Label>
            <input
              id='tokenImage'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
            <label
              htmlFor='tokenImage'
              className='flex flex-col items-center  justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors'
            >
              {/* <label
                htmlFor='tokenImage'
                className='cursor-pointer flex flex-col items-center'
              > */}
              {imagePreview ? (
                <img
                  src={
                    typeof formData?.iconUrl === "string"
                      ? formData?.iconUrl
                      : "/placeholder.svg"
                  }
                  alt='Token preview'
                  className='w-16 h-16 object-cover rounded-full mb-2'
                />
              ) : (
                <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2'>
                  {imgLoading ? (
                    <BtnLoader />
                  ) : (
                    <Upload className='h-6 w-6 text-muted-foreground' />
                  )}
                </div>
              )}
              <span className='text-sm text-muted-foreground'>
                {imagePreview ? "Change image" : "Upload token image"}
              </span>
            </label>
            {/* </label> */}
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-sm font-medium uppercase'
            >
              Description
            </Label>
            <Textarea
              id='description'
              className='resize-none'
              placeholder='Description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='initialSupply'
              className='text-sm font-medium uppercase'
            >
              Total Supply
            </Label>
            <Input
              id='initialSupply'
              placeholder='e.g. 1'
              type='number'
              min='1'
              value={formData.initialSupply}
              onChange={(e) =>
                setFormData({ ...formData, initialSupply: e.target.value })
              }
              required
            />
          </div>

          <div className='flex justify-between pt-6'>
            <Button type='button' variant='outline' asChild>
              <Link href='/'>GO BACK</Link>
            </Button>
            <Button
              type='submit'
              className='bg-primary text-primary-foreground'
            >
              CREATE TOKEN
              {loading ? <BtnLoader /> : null}
            </Button>
          </div>
        </form>
      </div>

      {showTransactionPopup && (
        <TransactionPopup
          onClose={() => {
            setShowTransactionPopup(false);
            setLoading(false);
          }}
          createTokenParams={formData}
          setLoading={setLoading}
          setCreateTokenParams={setFormData}
        />
      )}
    </div>
  );
}

