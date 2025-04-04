"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { BtnLoader, Loader } from "./Loader";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Updates({ token }:any) {
  const [comment, setComment] = useState("");
  const [updates, setUpdates] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState<any>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;
  const [errors, setErrors] = useState();
  const [submit, setSubmit] = useState(false);
  const { account } = useWallet();
    const address = account?.address?.toString();
    const [showPopup,setShowPopup]=useState(false)

  const fetchUpdates = async (page:any, search = "") => {
    try {
      if (updates.length === 0) setLoading(true);
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase
        .from("update")
        .select("*", { count: "exact" })
        .eq("tokenAddress", token?.tokenAddress) // Filter by tokenAddress
        .order("created_at", { ascending: false })
        .range(start, end);

      const { data, error, count } = await query;
      if (error) {
        console.log("Error fetching data:", error);
        setLoading(false);
        return;
      }
      setTotalDataCount(count);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setUpdates((prevTokens:any) =>
          page === 1 ? data : [...prevTokens, ...data]
        );
      }

      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchUpdates(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchMoreUpdate = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (comment === "") return; // Check if comment is empty and return if true

    try {
      setSubmit(true);
      const { data, error } = await supabase
        .from("update") // Ensure "update" is your actual table name
        .insert([{ update: comment, tokenAddress: token?.tokenAddress }]);

      if (error) {
        throw error; // Properly throw the error
      }

      // const updateObj = {
      //     tokenAddress:token?.tokenAddress,
      //     description: [
      //         {
      //             content: comment,
      //             updateAt: new Date(),
      //             id: new Date()
      //         }
      //     ]
      // }

      // const { data, error } = await supabase
      //     .from("updates")
      //     .upsert(
      //         updateObj,
      //         { onConflict: ["tokenAddress"] }
      //     )
      //     .select();

      // if (!error && data.length > 0) {
      // If the row already exists, update description by appending new data
      // const { error: updateError } = await supabase.rpc("append", {
      //         p_tokenaddress: token?.tokenAddress,
      //         p_new_value: updateObj.description[0]
      //     })

      //     if (updateError) {
      //         console.error("Error updating description:", updateError);
      //     } else {
      //         console.log("Description updated successfully");
      //     }
      // } else if (error) {
      //     console.error("Error inserting/updating:", error);
      // }
      setCurrentPage(1); // Reset to first page
      fetchUpdates(1, searchQuery);
        setComment(""); // Clear input after success
        setShowPopup(false)
    } catch (error:any) {
      setErrors(error?.message); // Store error message
      console.error("Error inserting data:", error);
    } finally {
      setSubmit(false); // Ensure loading is stopped
    }
  };

  return (
      <Card className='min-h-96'>
        <CardHeader className="flex items-center flex-row gap-3 ">
                  <CardTitle>Updates</CardTitle>
                  {address === token?.owner ?<Button onClick={()=>setShowPopup(true)} >Add Update</Button>:null}
        </CardHeader>
        <CardContent>
      {showPopup ? (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm'>
          <div className='relative w-full max-w-md rounded-2xl bg-[#0a0e1a] border border-[#1a2035] shadow-xl overflow-hidden'>
            <div className='p-6'>
              <button
                onClick={() => setShowPopup(false)}
                className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Close'
              >
                <X className='h-5 w-5' />
              </button>

              <h2 className='text-xl font-bold text-primary mb-6'>Updates</h2>

              <div className='mb-4'>
                <div className='flex flex-col flex-1 mb-3'>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Add an update'
                    className='flex-1 w-full px-3 py-2 rounded-lg  active:border-none outline-none mb-0 resize-none border'
                  />
                  {errors && (
                    <p className='text-red-500 text-sm mt-1'>{errors}</p>
                  )}
                </div>
              </div>

              <Button
                variant='default'
                className='w-full px-4 py-2 !mt-3 rounded-lg flex items-center justify-center gap-3 font-normal text-[16px] min-w-24 h-10 bg-[#3b82f6] hover:bg-[#2563eb]'
                type='button'
                onClick={handleSubmit}
              >
                {submit ? (
                  <BtnLoader />
                ) : (
                  <span className='inline-block w-[60px] text-center'>
                    Submit
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <InfiniteScroll
        dataLength={updates.length}
        next={fetchMoreUpdate}
        hasMore={updates.length < totalDataCount}
        // scrollThreshold={"50%"}
        loader={loading}
        height={"40vh"}
      >
        {loading ? (
          <div className='flex items-center w-[100%] justify-center h-64'>
            <Loader className='text-[#7C7C7C]' />
          </div>
        ) : (
          <div className='text-white'>
            {updates && updates.length
              ? updates.map((update: any, index: number) => (
                  <div key={index} className='w-[90%] py-4'>
                    <div className='flex flex-col items-start gap-3'>
                      {/* <p className="font-bold text-[#000000] font-primary text-[14px]">{update.name}</p> */}
                      <p className=' font-primary font-normal text-[16px]'>
                        {update.update}
                      </p>
                      <p className=' font-primary font-normal text-[12px]'>
                        Date: {new Date(update.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              : updates &&
                !updates.length && (
                  <div className='flex items-center w-[100%] justify-center h-64'>
                    <p className=' font-primary font-normal text-[16px]'>
                      No Updates
                    </p>
                  </div>
                )}
          </div>
        )}
      </InfiniteScroll>
       
        </CardContent>
      </Card>

  );
}
