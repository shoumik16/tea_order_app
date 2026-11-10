import PaymentButtons from "./PaymentButtons";
export default async function UserPage({ params }) {
     const { username } = await params;
  return (
    <div>
     
       
       
        <div>
            <img className="h-[350]" src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4842667/452146dcfeb04f38853368f554aadde1/eyJ3IjoxMjAwLCJ3ZSI6MX0%3D/20.gif?token-hash=czWd4rDaWCOBkDGzxXR8d2JEu1eDoNCAZnZ_jrGuvA0%3D&token-time=1796342400" alt="User Avatar" />
        </div>
      
        <h1 className="text-2xl font-bold mt-5">
        Support {username}
      </h1>

      <p className="my-4">
        Choose an amount to support this user.
      </p>

      <PaymentButtons username={username} />
    </div>
  );
}