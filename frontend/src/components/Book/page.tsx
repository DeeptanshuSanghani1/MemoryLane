const Page = ({ number }: { number: number }) => (
    <div className="page bg-white shadow-lg rounded-lg p-10 flex items-center justify-center text-center text-lg font-semibold">
        <div>
            <h2>Page {number}</h2>
        </div>
    </div>
);
export default Page
