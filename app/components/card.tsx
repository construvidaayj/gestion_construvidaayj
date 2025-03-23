export default function Card() {
    return (
        <div className="relative max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-4 space-y-4">

            {/* Etiqueta flotante */}
            <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                Variables
            </span>

            {/* Bloque de código */}
            <pre className="bg-gray-100 text-sm text-gray-800 p-3 rounded font-mono overflow-auto whitespace-pre-wrap">
                {`age = 18        # age is of type int
name = "John"  # name is now of type str
print(name)`}
            </pre>

            {/* Comentario final */}
            <p className="text-blue-600 text-sm">
                Python can't declare a variable without assignment.
            </p>
        </div>
    );
};
