import Card from "@/app/components/card";
import ClientsTableWithPagination from "@/app/components/tableWithPagination";
import { dataTables } from "@/app/data/dataTables";

export default function pagina (){
  return(
    <>
      <ClientsTableWithPagination data={dataTables}/>
      <Card/>
    </>
  );
}