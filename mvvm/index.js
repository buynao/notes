/**
 * MVVM
 * Model : 数据模型，一般也在Model中，定义数据的修改和操作业务逻辑
 * View : 代表ui组件，将数据模型转化成ui展现出来
 * ViewModel : 同步view和model的对象，View和Model没有直接的联系，通过ViewModel进行交互
 * model 和 viewmodel直接的交互是双向的，因此view的数据的变化会同步到model中，而model数据的变化也会立即反应到view上
 * 
 * 
 * 架构：
 *           劫持监听所有属性                   ------   
 *               Observer  --- 通知变化-----> | Dep | - - - -
 *             /                             ------ \      |
 *            /                             添加订阅者 \   通知变化
 *           /                                         \   |
 * new MVVM()                                           -————————--
 *           \                                          | Watcher |
 *            \          ---订阅数据变化，绑定更新函数---->  |_________|  
 *             \        /                                  /
 *             Compile /                                  /
 *              解析指令                                  /
 *                  \                             更新实图 
 *                   \                             /
 *                  初始化试图                      /
 *                      \                        /
 *                       \       __________     /
 *                        ----->|  Updater |<--/
 *                              ————————————
 * 
 * Obersver 数据监听器，能够对数据对象的所有熟悉进行监听
 * Compile 指令解析器，对每个元素节点的指令进行扫描和解析，根据指令模版替换数据，以及绑定相应的回调函数
 * Watcher 订阅者，作为连接Obersver 和 Compile 的桥梁，订阅并收到每个熟悉变动的通知，执行指令绑定的相应回调函数
 * Dep 消息订阅起，内部维护了一个数组，用来收集订阅者(Watcher)，数据变动触发notify函数，在调用订阅者的update方法
 */
class Mvvm{
    constructor(opt) {
        this.el = opt.el;
        this.data = opt.data;
        // 数据代理
        Object.keys(this.data).forEach((key) => {
            this.proxyData(key);
        });
        // 数据改造响应式
        this.obersver(opt.data);
        // 数据编译
        this.compile();
    }
    /**
     * 数据代理
     * this.xx => this.data.xx
     */
    proxyData(key) {
        var vm = this;
        Object.defineProperty(vm, key, {
            get() {
                return vm.data[key]
            },
            set(newVal){
                vm.data[key] = newVal;
            }
        })
    }
    /** 
     * 将data改造成响应式对象
    */
    obersver(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.defineReactive(data, key, data[key])   
            }
        }
    }
    /**
     * 给对象动态添加 getter 和 setter
     * 为了在我们访问数据以及写数据的时候能自动执行一些逻辑：
     * getter 做的事情是依赖收集，setter 做的事情是派发更新
     */
    defineReactive(data, key, value) {
        var dep = new Dep();
        // 监听子属性
        this.obersver(value);
        Object.defineProperty(data, key, {
            get: function(key) {
                // 添加订阅者 Watcher
                dep.addSub(Dep.target);
                return value;
            },
            set: function(newVal) {
                if (value === newVal) return;
                console.log(`监听到值${key}的变化,从value:${value} -> 到newVal:${newVal}`);
                value = newVal;
                dep.notify(); // 通知所有订阅者 Watcher
            }
        });
    }
    // 编译当前模版
    compile() {
        new Compile(this.el, this);
    }
}

/**
 * 订阅者
 * 连接响应式对象和指令编译器
 * 1. 在自身实例化时往属性订阅器(dep)里面添加自己
 * 2. 自身必须有一个update()方法
 * 3. 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退
 */
class Watcher{
    constructor(vm, attr, cb) {
        this.cb = cb; // 更新view的update
        this.vm = vm; // vm
        this.attr = attr;
        this.depIds = {};
        // 触发响应式对象的属性 gertter 方法，进行绑定
        this.value = this.get();
    }
    get() {
        Dep.target = this;
        var value = this.vm[this.attr]; // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
        Dep.target = null;
        return value;
    }
    // 属性值变化收到通知
    update() {
        var value = this.get();
        this.value = value;
        this.cb.call(this.vm, value);
    }
}
/**
 * 依赖收集
 * 消息订阅器，subs用来收集订阅者
 * Dep 实际上就是对 Watcher 的一种管理，Dep 脱离 Watcher 单独存在是没有意义的
 * 整个getter依赖收集的核心
 */
class Dep{
    constructor() {
        // Watcher 的实例数组
        this.subs = [];
    }
    addSub(sub) {
        if (sub) {
            // sub => new Watcher(vm, attr, cb);
            this.subs.push(sub);
        }
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
// 定义一个全局的属性，暂存watcher，添加完移除
Dep.target = null;

/**
 * Compile
 * 1. 解析模版指令，将模版中的遍历替换成数据
 * 2. 然后初始化渲染页面视图
 * 3. 并将每个指令对应的节点绑定更新函数
 * 4. 添加监听数据的订阅者，一旦数据有改动，收到通知，更新视图
 */
class Compile{
    constructor(el, vm) {
        this.vm = vm;
        this.$el = document.querySelector(el); // 找到节点
        this.init(); // 初始化
    }
    init() {
        this.compileElement(this.$el);
    }
    /**
     * 解析模版指令
     * 将指令的节点绑定更新函数
     * @param {dom} el 
     */
    compileElement(el) {
        var childNodes = [...el.childNodes];
        var that = this;
        childNodes.forEach((node) => {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/; // 表达式文本 {{ text }}
            // 按元素节点方式编译
            if (that.isElementNode(node)) {
                that.compile(node);
            } else if (that.isTextNode(node) && reg.test(text)) {
                that.compileText(node, RegExp.$1.trim());
            }
        })
    }
    /** 
     * 解析dom节点中的指令，
     * 此处只考虑v-model情况
    */
    compile(node) {
        var attrs = [...node.attributes];
        var that = this;
        attrs.forEach((attr) => {
            if (attr.nodeName === 'v-model') {
                name = attr.nodeValue;
                that.compileModel(node, name);
            }
            // 其他事件指令...
        });
    }
    /**
     * model解析
     * @param {dom} node 
     * @param {attributes} attr 
     */
    compileModel(node, attr) {
        var vm = this.vm;
        node.addEventListener('input', function(e) {
            if (node === e.target) {
                var value = e.target.value;
                vm[attr] = value;
            }
        });
        // 同步更新input节点
        node.value = vm[attr];
        new Watcher(vm, attr, function (value) {
            // 同步更新input节点
            node.value = value;
        });
    }
    /**
     * 解析文本
     * @param {dom} node 
     * @param {attributes} attr 
     */
    compileText(node, attr) {
        console.log(`开始绑定`, this.vm, attr);
        // 初始化 - 更新文本节点
        node.textContent = this.vm[attr];
        // 监听属性 ->  observer
        // 绑定更新函数 -> compile
        new Watcher(this.vm, attr, function(value) {
            // 更新文本节点
            node.textContent = value;
        });
    }
    isElementNode(node) {
        return node.nodeType === 1;
    }
    isTextNode(node) {
        return node.nodeType === 3;
    }
}

var app = new Mvvm({
    el: '#app',
    data: {
        text: 'text',
        xxx: 'xxx'
    }
});