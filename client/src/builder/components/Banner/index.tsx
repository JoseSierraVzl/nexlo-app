export default function Banner({ title = "Bienvenido a Nexlo", subtitle }: any) {
    return (
        <div className="bg-blue-600 text-white py-20 text-center rounded-lg shadow">
            <h1 className="text-4xl font-bold">{title}</h1>
            {subtitle && <p className="text-lg mt-2 opacity-90">{subtitle}</p>}
        </div>
    );
}
