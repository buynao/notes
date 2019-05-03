## React 16的Diff算法

React 更新到16版本以后，diff算法发生了一些变化，在此简单的作下介绍

### 数据结构的差异

首先是React Element的数据结构由之前的VirtualDom Tree改成了Fiber节点组成的Fiber Tree。

之前树的递归遍历改成了链表形式的循环遍历。

```
// Fiber Node
{
    alternate: Fiber|null, // 在fiber更新时克隆出的镜像fiber，对fiber的修改会标记在这个fiber上
    nextEffect: Fiber | null, // 单链表结构，方便遍历 Fiber Tree 上有副作用的节点
    pendingWorkPriority: PriorityLevel, // 标记子树上待更新任务的优先级

	stateNode: any, // 管理 instance 自身的特性，当前dom节点
    return: Fiber|null, // 指向 Fiber Tree 中的父节点
    child: Fiber|null, // 指向第一个子节点
    sibling: Fiber|null, // 指向兄弟节点
}
```

### diff算法背景的对比

stack reconciler：
- 自顶向下，一次性完成
- 无法中断
- 基于js单线程的机制，处理复杂业务场景，不可避免的出现掉帧卡顿情况

fiber reconciler：
- 将整个fiber tree拆分成一系列小任务
- 异步，分割
- 将小任务分散到浏览器的空闲时间执行requestIdleCallback
- 通过节点保存和映射，随时进行中断和重启
- 添加优先级策略，通过过期时间
  
### 何时开始diff
- scheduleWork -> requestWork -> performWork -> performWorkOnRoot -> renderRoot -> workLoop -> performUnitOfWork -> beginWork -> updateHostComponent -> reconcileChildren -> reconcileChildFibers(开始) -> 。。。 -> commitAllHostEffects(更新effectTag) -> 

## 怎么diff

### 阶段一：reconciliation
- setState 先把此次更新放到更新队列 updateQueue 里面，然后调用调度器开始做更新任务。performWork 先调用 workLoop 对 fiber 树进行遍历比较
- 自顶向下构建一颗完整的 Fiber Tree， 在 rerender 的过程中，根据之前生成的树，构建名为 workInProgress 的 Fiber Tree 用于更新操作，构建workInProgress tree的过程就是diff的过程
- 通过requestIdleCallback来调度执行每一个 fiber 节点，过程中，react 都会检查当前时间片是否够用
- 如果发现当前时间片不够用了，就是会标记下一个要处理的nextUnitOfWork节点，
- nextUnitOfWork 是个全局变量，记录 workLoop 遍历 fiber 树中断在哪个节点，如果存在就继续遍历，不存在就寻找fiber根节点
- react 通过依次对比 fiber 节点发现 change，就会在对应生成的 workInProgress Tree 中打一个 Tag，并且推送到 effect list 中
- reconcileChildFibers函数中主要是根据newChild类型，调用不同的Diff算法：
   1. Symbol(react.element) => 单个元素，调用reconcileSingleElement
   2. Symbol(react.portal)  => 单个Portal元素，调用reconcileSinglePortal
   3. (typeof newChild === 'string' || typeof newChild === 'number') => 调用reconcileSingleTextNode
   4. isArray(newChild) => 调用reconcileChildrenArray -> 渲染
- 当reconciliation结束后，根节点的 effect list 里记录了包括 DOM change 在内的所有 side effect

### 阶段二：commit
- 在调度后，commit阶段，取到reconciliation阶段产生的EffectList，会通过commitAllHostEffects函数进行遍历更新，根据effectTag标记识别dom的操作类型
- 此函数主要是遍历EffectList，根据nextEffect.effectTag，调用对应commit方法
  1. update = 4 -> ommitWork(nextEffect.alternate, nextEffect);
  2. Placement = 2 -> commitPlacement(nextEffect)
  3. PlacementAndUpdate = 6 -> commitPlacement(nextEffect) -> commitWork(nextEffect.alternate, nextEffect);
  4. Deletion = 8 -> commitDeletion(nextEffect);
- commit方法根据nextEffect.tag调用对应的更新dom方法


### fiber tree与workInProgress tree
- 双缓冲技术，以fiber tree为主，workInProgress tree为辅
- 双缓冲具体指的是workInProgress tree构造完毕，得到的就是新的fiber tree，然后喜新厌旧（把current指针指向workInProgress tree，丢掉旧的fiber tree）就好了

### 优先级策略
- synchronous 与之前的Stack reconciler操作一样，同步执行
- task 在next tick之前执行
- animation 下一帧之前执行
- high 在不久的将来立即执行
- low 稍微延迟（100-200ms）执行也没关系
- offscreen 下一次render时或scroll时才执行