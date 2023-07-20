const loadBalancer = {};

loadBalancer.ROUND_ROBIN = (service) => {
    return ++service.lastIndex >= service.length ? 0 : service.index;
};

export default loadBalancer;
