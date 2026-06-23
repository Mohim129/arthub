import { File } from "@gravity-ui/icons"; // safe icon for receipt

export default function PurchaseHistoryTable({ purchases }) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-h1-desktop text-h1-desktop text-on-surface">
            Purchase History
          </h1>
          <p className="font-body-large text-body-large text-on-surface-variant">
            Track your acquisitions and digital certificates.
          </p>
        </div>
        <button className="flex items-center gap-xs text-primary font-bold hover:underline">
          <File className="text-sm" />
          Export CSV
        </button>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/50">
              <tr>
                <th className="px-md py-md font-label-caps text-label-caps text-outline">
                  Artwork
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-outline">
                  Artist
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-outline">
                  Price
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-outline">
                  Date
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-outline text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {purchases.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="px-md py-md">
                    <div className="flex items-center gap-md">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-outline-variant/30"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      <div>
                        <p className="font-h3 text-h3 text-on-surface">
                          {item.artwork}
                        </p>
                        <p className="font-body-small text-body-small text-outline">
                          {item.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-md font-body-large text-on-surface-variant">
                    {item.artist}
                  </td>
                  <td className="px-md py-md font-h3 text-h3 text-primary">
                    {item.price}
                  </td>
                  <td className="px-md py-md font-body-large text-on-surface-variant">
                    {item.date}
                  </td>
                  <td className="px-md py-md text-right">
                    <button className="p-sm rounded-full hover:bg-primary-container/10 text-primary transition-colors">
                      <File />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
