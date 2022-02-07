export default function ErrorAlert({ errorMsg }: { errorMsg: string }) {
  return (
    <div className="panel">
      <h2 className="panel-heading">Error</h2>
      <div className="panel-body p-6 bg-white flex flex-row space-x-4 text-red-600 whitespace-pre-line">
        {errorMsg}
      </div>
    </div>
  );
}
