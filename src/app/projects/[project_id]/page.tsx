"use client";

import { fetchProject } from "@/api/endpoints/project";
import useGlobalApi from "@/api/global-api";
import { Card } from "@/components/ui/card";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { Component } from "react";
import { FaClock } from "react-icons/fa";
import { IoAnalytics } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { PiStackSimpleFill } from "react-icons/pi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function ProjectHome() {
  const params = useParams();
  const route = useRouter();
  const { loading, data } = useGlobalApi(
    () => fetchProject(params.project_id as string),
    undefined,
    true
  );
  console.log(data);

  function onNavigate(to:string){
    route.push(to);
  }

  if (!data) return null;
  return (
    <div>
      <div className=" w-full">
        <div className="flex justify-start items-center gap-3">
          <h1 className="text-xl font-semibold">{data["name"]}</h1>
          <p className=" bg-red-500 rounded-lg px-2 py-1 text-sm">Offline</p>
          <MdOutlineRefresh className=" cursor-pointer text-xl" />
        </div>
        <p className=" my-5 text-sm text-muted-foreground">
          {data["description"]}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {/* <div className=' flex w-full h-full border border-white/[.2] rounded-2xl'>

          </div> */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Stacks
            </h3>
            <PiStackSimpleFill className=" text-muted-foreground"/>
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">{data["stacks"].length} stacks</div>
            <p className="text-xs text-muted-foreground">
              total in  {data["name"]}
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Duration
            </h3>
            <FaClock className=" text-muted-foreground"/>
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">145 hours</div>
            <p className="text-xs text-muted-foreground">
              since 25th October 2023
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-8 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              LPS
            </h3>
            <IoAnalytics className=" text-muted-foreground"/>
          </div>
          <div className="p-8 pt-0">
            <div className="text-2xl font-bold">1085</div>
            <p className="text-xs text-muted-foreground">
              Logs per second
            </p>
          </div>
        </div>
      </div> 
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-8">
        
        <div>
      <div className=" flex justify-between w-full items-center">
      <h1 className=" font-semibold text-base">Stacks</h1>
      <Link href={`/projects/${params.project_id}/stacks/new`}>
          <p className=" h-fit cursor-pointer px-4 my-1 py-2 bg-white text-black flex justify-center align-middle rounded-lg text-base">
            New stack
          </p>
        </Link>
      </div>
      <div className="max-w-full">
      <Table>
  <TableCaption>A list of your stacks.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">LPS</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className=" overflow-auto">
    {data["stacks"].map((stack:any, index:number)=>(
      // <Link href={`/projects/${params.project_id}/stacks/${stack.sId}`} className="w-full">
        
      // </Link>
      <TableRow className=" cursor-pointer" onClick={()=>onNavigate(`/projects/${params.project_id}/stacks/${stack.sId}`)}>
      <TableCell className="font-medium">{stack["name"]}</TableCell>
      <TableCell>{stack["description"]}</TableCell>
      <TableCell>Online</TableCell>
      <TableCell className="text-right">280</TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>
        {/* <HoverEffect
          items={data["stacks"]}
          projectId={params.project_id as string}
        /> */}
      </div>
        </div>
        <div>
          <h1 className=" font-semibold text-base">Project Logs</h1>
      <div className=" max-w-full h-[50vh] border bg-[#000000] my-5 rounded-lg overflow-y-auto p-5">
        <p className=" text-muted-foreground tracking-wide leading-relaxed text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
          molestias assumenda blanditiis magnam dolorem cumque cupiditate fuga
          sequi et tempore aliquam praesentium provident rerum consequuntur
          voluptatibus, corporis natus deleniti odit perferendis, iusto facere
          sapiente? Quam architecto, corrupti, eveniet recusandae cupiditate
          veniam ratione assumenda unde exercitationem neque non, omnis
          blanditiis. Voluptatibus fugiat molestiae necessitatibus ea fuga
          itaque accusamus tempore ullam, quibusdam sequi! Sit dicta laudantium
          deleniti quae vitae nesciunt eveniet, aut, id ipsum aliquid mollitia
          sed saepe tempore perspiciatis nisi! A, voluptate repellendus nesciunt
          modi itaque voluptatibus, fuga commodi, officia consectetur
          praesentium eos. Et tempore voluptates harum omnis praesentium
          veritatis? Consequuntur, deserunt? Laborum, repudiandae blanditiis
          beatae, fugiat dolores veritatis dolor facere pariatur id nisi
          possimus. Temporibus odio rem consectetur deleniti voluptatibus. Nihil
          quidem assumenda magnam tenetur laboriosam quas repellendus iusto,
          itaque veniam, hic dicta reiciendis rem esse minus illum unde harum
          omnis quisquam voluptate inventore enim dignissimos aperiam! Dolorum
          nostrum tenetur magnam maiores autem nobis alias corporis ea vero
          facilis? Dolores est numquam maiores voluptates beatae doloremque,
          voluptate exercitationem consequuntur iste, minus aperiam at illum.
          Praesentium odio dolorum iure atque quae, voluptatum quia voluptate
          fugiat maxime blanditiis enim itaque in saepe voluptas neque
          voluptatibus non doloribus molestias mollitia accusantium! Ipsum
          delectus quos perferendis ipsa nihil. Molestiae porro veritatis
          dignissimos dolor debitis quis accusamus aperiam, maxime natus
          laudantium nobis unde vero adipisci accusantium a ipsam! Rem ipsam,
          minus odio quae quo cum porro! Neque fugit hic laborum incidunt unde
          odit possimus quis voluptates beatae officiis quos quaerat enim
          voluptas quo nemo, corporis voluptatibus. Ducimus doloremque officiis,
          voluptatem voluptatibus quis consequuntur autem cum sit impedit
          explicabo laborum iure, facere ullam at distinctio fuga harum pariatur
          possimus veritatis officia! Asperiores corrupti quis dicta nulla
          obcaecati ratione. Incidunt laudantium sunt eligendi, ipsam deserunt
          maiores recusandae quos temporibus nihil autem tenetur ex ullam,
          consequuntur accusantium nobis, quaerat dolor culpa quod officiis
          distinctio excepturi? Maxime praesentium aperiam dolore exercitationem
          facilis nam dolorem quos nostrum libero tempore quasi earum aliquam
          alias sequi repellat quas expedita molestiae, aspernatur similique
          vero esse! Tempora consequatur cupiditate, doloribus quasi reiciendis
          molestiae suscipit beatae animi adipisci? Quod vero, quaerat et, quasi
          asperiores voluptatibus harum in voluptates voluptatem facere velit
          assumenda nihil? Vitae dolores delectus necessitatibus eligendi
          accusantium corporis nihil nobis ducimus voluptate temporibus? Atque
          obcaecati accusantium cupiditate aperiam vero natus, soluta dicta
          necessitatibus reprehenderit, repellendus quidem distinctio ut,
          doloremque adipisci totam nisi aut? Pariatur vitae officia repudiandae
          quia temporibus enim distinctio, quam, odio a reprehenderit ducimus.
          Fugit excepturi eum a blanditiis sequi! Quia nulla distinctio tempora
          dolores sint atque enim aliquid aperiam, molestiae deserunt cupiditate
          hic tempore tenetur totam porro recusandae numquam! Maxime ratione
          nesciunt ducimus quia rem officia dolorum possimus recusandae eveniet
          aperiam nam architecto, laboriosam asperiores expedita et. Quibusdam
          ea doloribus quod deserunt dolorem eveniet eaque corporis distinctio
          ex. Ducimus reiciendis debitis totam distinctio vero labore architecto
          voluptates hic culpa maiores aperiam est, veniam ratione, consequatur,
          odio earum reprehenderit sit fugit. Iure necessitatibus quidem laborum
          nulla corporis totam consequuntur quas quod nam consequatur quaerat
          labore veritatis veniam unde non, provident exercitationem eius velit,
          perferendis sequi sapiente. At debitis fugit et, libero repellat
          dolorum praesentium, ipsa sapiente maxime fuga quod cum voluptates!
          Odio, id? Facilis rem cupiditate assumenda officia eum provident
          quidem natus. Quae laudantium atque nulla illo, possimus corrupti
          perferendis, hic officia cum voluptas vel neque consequuntur quisquam
          debitis porro esse distinctio asperiores quia culpa. Quasi ea
          laudantium earum dolore corporis, impedit veniam voluptas, alias harum
          minus ut voluptatem adipisci! Voluptatem maxime eum eius consequatur
          asperiores magnam tempore nobis. Cumque doloremque architecto earum
          molestiae tempore, nihil corrupti. Nobis eligendi necessitatibus
          excepturi provident doloribus at suscipit. Odio omnis corrupti, nam
          ullam facilis quos nihil maiores alias illo quas voluptatem
          consequatur explicabo numquam saepe modi vitae pariatur temporibus
          quod fugiat accusantium, voluptas illum! Voluptas dolor placeat illum,
          aut modi esse ad enim ut rem necessitatibus laudantium assumenda
          facilis repellat aliquam deleniti praesentium labore sapiente
          excepturi nulla tempora tenetur libero fuga quia. Et modi perferendis
          quos! Commodi asperiores beatae illum earum placeat. Odio atque vero
          facere? Sequi ipsum quam minima reiciendis voluptatum explicabo
          aperiam eaque veritatis, eos sapiente expedita nemo unde eveniet, sed
          laboriosam atque voluptatibus, tempore excepturi quidem animi commodi
          error! Quas quod assumenda, cumque laborum obcaecati molestiae quia
          deleniti sapiente tempora voluptate porro cupiditate ipsam quae unde
          repellat optio eos, vel rerum ratione fugit aliquam. Temporibus
          architecto sit reprehenderit, tenetur laboriosam quasi possimus natus
          dolore, beatae explicabo amet modi. Quia, adipisci atque
          necessitatibus rerum voluptatum veritatis dolor fugiat nostrum sed
          explicabo, mollitia magnam omnis? Tempore omnis, placeat vitae eum
          tempora quam voluptate optio culpa. Accusamus quis consectetur ipsa
          labore sed nulla illo quaerat atque accusantium ea natus excepturi,
          quo iusto quia tempora ratione quibusdam quae. Animi, obcaecati
          delectus cupiditate ad sint, architecto error excepturi eveniet eum
          quasi magnam, molestias dicta dolorum. Tenetur excepturi aut
          cupiditate culpa, autem deserunt. Deleniti repudiandae eveniet illum,
          voluptates dolor molestiae quos deserunt. Tempore qui perferendis
          excepturi quaerat numquam facere, iste nisi unde? Officia impedit,
          natus ut dolorem iste non, et repudiandae aliquid doloribus, pariatur
          magni. Sed vero et, deserunt, fuga inventore molestiae cumque amet
          veritatis maiores autem quos enim voluptatem dicta eaque tempore,
          soluta asperiores recusandae nesciunt doloremque labore natus! Rem
          error officiis tempore eveniet ipsa deleniti, ea amet. Consequatur
          nemo odio alias deserunt magnam at ad inventore, nesciunt delectus
          earum accusantium, explicabo obcaecati provident assumenda eos vitae
          maiores nisi labore optio a. Eaque corrupti ipsum error debitis
          perspiciatis consequuntur et excepturi, fugit suscipit! Quibusdam rem
          doloremque, vel similique cupiditate architecto quo eligendi facilis
          eaque aspernatur atque, earum error ab aut voluptates esse expedita
          perspiciatis voluptatibus iste repellat officiis nam velit totam
          ratione. Quisquam, aut! Voluptas similique ipsam magni consectetur
          suscipit hic exercitationem saepe in accusantium. Minima, eligendi
          aliquam! Ut natus alias repellat eaque sed unde quas aut error iusto
          id, eos quod ullam beatae culpa accusamus doloribus eius sequi illo!
          Vero placeat officia quidem a dolores possimus, odio rerum dolorum
          voluptate, expedita debitis explicabo nihil veniam quas ullam.
          Facilis, nihil perspiciatis saepe placeat provident reiciendis
          quibusdam nostrum expedita unde. Officiis iure consequuntur quos ipsam
          neque laborum?
        </p>
      </div>
        </div>
      </div>
      
      
    </div>
  );
}
