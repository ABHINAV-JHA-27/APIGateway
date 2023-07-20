const loadBalancer = {};

loadBalancer.ROUND_ROBIN = (service) => {
    const index = ++service.lastIndex >= service.length ? 0 : service.index;
    service.index = index;
    return loadBalancer.isEnabled(service, index, loadBalancer.ROUND_ROBIN);
};

loadBalancer.isEnabled = (service, index, strategy) => {
    return service.instances[index].enabled ? index : strategy(service);
};

export default loadBalancer;
