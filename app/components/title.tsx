export default function Title({titlePage}: {titlePage: string}) {
    return (
        <>
            <section className="text-center p-20 text-6xl">
                <h1>Hola desde <strong className="text-green-400">{titlePage}</strong></h1>
            </section>

            
        </>
    );
}