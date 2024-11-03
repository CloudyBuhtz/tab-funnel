import { UUID } from "@/entrypoints/utils/data";
import { Options, TInstanceOption } from "@/entrypoints/utils/options";
import { TSyncInstance } from "@/entrypoints/utils/storage";

interface InstanceListProps {
  option: TInstanceOption;
}

export default ({ option }: InstanceListProps) => {
  const [instances, setInstances] = useState<TSyncInstance[]>(option.item.fallback);
  const [localInstance, setLocalInstance] = useState<TSyncInstance>();
  const [uuid, setUuid] = useState<UUID>(Options.TAB_SYNC_UUID.item.fallback);
  const nameRef = useRef<HTMLInputElement>(null);
  const unwatchInstances = option.item.watch(v => setInstances(v));
  const unwatchUUID = Options.TAB_SYNC_UUID.item.watch(v => setUuid(v));

  useEffect(() => {
    const setup = async () => {
      setInstances(await option.item.getValue());
      setUuid(await Options.TAB_SYNC_UUID.item.getValue());
    };
    setup();
  }, []);

  useEffect(() => {
    setLocalInstance(instances.find(v => v.id === uuid));
  }, [instances, uuid]);

  const addInstance = async () => {
    if (!nameRef.current) return;
    if (nameRef.current.value.length === 0) return;

    await Options.TAB_SYNC_INSTANCES.item.setValue([...instances, ...[{
      id: uuid,
      name: nameRef.current.value,
    } satisfies TSyncInstance]]);
  };

  const updateInstance = async () => {
    if (!nameRef.current) return;
    if (nameRef.current.value.length === 0) return;

    await Options.TAB_SYNC_INSTANCES.item.setValue([...instances.filter(i => i.id !== uuid), ...[{
      id: uuid,
      name: nameRef.current.value
    } satisfies TSyncInstance]]);
  };

  const removeInstance = async (id: UUID) => {
    const instances = await Options.TAB_SYNC_INSTANCES.item.getValue();
    await Options.TAB_SYNC_INSTANCES.item.setValue(instances.filter(i => i.id !== id));
  };

  const sortedInstances = instances?.slice().sort((a, b) => {
    if (a.id === uuid && b.id !== uuid) return -1;
    if (a.id !== uuid && b.id === uuid) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className="option">
        <label htmlFor={option.name}>{i18n.t(option.label as any)}</label>
        <div className="spacer"></div>
      </div>
      <div className="option instances">
        {instances?.length === 0 &&
          <div className="instance empty">No Instances</div>
        }
        {sortedInstances.map(i => (
          <div key={i.id} className="instance">
            <div className="icon">
              {i.id === uuid ?
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"></path>
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2M7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78A7.9 7.9 0 0 1 12 20c-1.86 0-3.57-.64-4.93-1.72m11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.5-1.64 4.83M12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6m0 5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 8a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 11"></path>
                </svg>
              }
            </div>
            <div className="name">{i.name}</div>
            <div className="spacer"></div>
            <div onClick={() => { removeInstance(i.id); }} className="remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path>
              </svg>
            </div>
          </div>
        ))}
      </div>
      <div className="option">
        <input ref={nameRef} className="grow" type="text" defaultValue={localInstance?.name}></input>
        <button onClick={() => { localInstance ? updateInstance() : addInstance(); }}>{localInstance ? "Update Name" : "Add Instance"}</button>
      </div>
      {option.description &&
        <div className="description">
          {option.description.map((line, index) => (
            <div key={index}>{i18n.t(line as any)}</div>
          ))}
        </div>
      }
    </>
  );
};
