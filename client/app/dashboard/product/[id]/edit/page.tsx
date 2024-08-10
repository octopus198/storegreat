import Form from '@/app/ui/product/edit-product';
import { fetchProductById } from '@/app/lib/data';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log(id)
    const productDetail = await fetchProductById(id)
       
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-7/12 space-y-3">
        <h1 className="text-zinc-700 font-semibold text-2xl">
          <Link href={"/dashboard/product"}>
            <ArrowLeftIcon className="inline mr-1 size-5" />
            Product details
          </Link>
        </h1>
        <Form productDetail={productDetail}/>
      </div>
    </div>
  );
}