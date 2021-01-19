<template>
  <div class="body">

    <div class="tbody">
      <el-steps :active="active" finish-status="success">
        <el-step title="商品信息"></el-step>
        <el-step title="属性信息"></el-step>
        <el-step title="提交"></el-step>
      </el-steps>
      <!-- 个人信息 -->
      <div class="info" v-if="active==1">
        <el-form ref="shopAdd" :model="shopAdd" label-width="80px">

          <el-form-item label="商品名称">
            <el-input v-model="shopAdd.name" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品标题">
            <el-input v-model="shopAdd.title" style="width: 500px"></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="shopAdd.brandId" placeholder="请选择分类">
               <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in BrandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品介绍">
            <el-input type="textarea" style="width: 200px"  v-model="shopAdd.productdecs"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="shopAdd.price" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品库存">
            <el-input v-model="shopAdd.stocks"></el-input>
          </el-form-item>

          <el-form-item label="排序字段">
            <el-input v-model="shopAdd.sortNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="info" v-if="active==2">
        <el-form ref="peopertyAdd" :model="peopertyAdd" label-width="80px" >
        <el-form-item label="商品类型" prop="typeId">
          <el-select v-model="peopertyAdd.typeId" placeholder="请选择分类" @change="selectChange">
            <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

          <el-form-item v-model="peopertyAdd.peopertyId" v-if="skuData.length>0" label="商品参数" prop="peopertyId">
            <el-form-item v-for="a in  skuData" :key="a.id" :label="a.peopertyName">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-select v-if="a.peopertyType==0" v-model="xia" placeholder="请选择">
                <el-option v-for="item in a.values" :key="item.id"  :label="item.peopertyName" :value="item.nameCh"></el-option>
              </el-select>

              <el-radio-group  v-if="a.peopertyType==1" v-model="dan">
                <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
              </el-radio-group>

              <el-checkbox-group  v-if="a.peopertyType==2" v-model="duo">
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" name="type"></el-checkbox>
              </el-checkbox-group>

              <el-input v-if="a.peopertyType==3"></el-input>
            </el-form-item>
          </el-form-item>


          <el-form-item v-model="peoper" v-if="notSkuData.length>0" label="商品规格" prop="peopertyId">
            <el-form-item v-for="a in  notSkuData" :key="a.id" :label="a.peopertyName">

              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-select v-if="a.peopertyType==0" v-model="xia" placeholder="请选择">
                <el-option v-for="item in a.values" :key="item.id"  :label="item.peopertyName" :value="item.nameCh"></el-option>
              </el-select>

              <el-radio-group  v-if="a.peopertyType==1" v-model="dan">
                <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
              </el-radio-group>

              <el-checkbox-group  v-if="a.peopertyType==2" v-model="duo">
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" name="type"></el-checkbox>
              </el-checkbox-group>

              <el-input v-if="a.peopertyType==3"></el-input>
            </el-form-item>
          </el-form-item>




        </el-form>

      <!--  <div style="margin-top:20px;" v-for="(item,index) in shopType" :key="index">
          <el-button type="success" @click="processing()">一键生成</el-button>
          <el-button type="success" @click="setType()">添加商品规格</el-button>

        </div>-->
        <div>
          <!-- 我记得有个scope属性的 -->
        <!--  <el-table :data="tableData7" :span-method="objectSpanMethod1" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="color" :label="retName(index)" width="180"></el-table-column>
            <el-table-column prop="cailiao" :label="retName(index)"></el-table-column>
            <el-table-column prop="chima" :label="retName(3)"></el-table-column>
            <el-table-column prop="kucun" label="库存"></el-table-column>
            <el-table-column prop="moany" label="金钱"></el-table-column>
          </el-table>-->
        </div>
      </div>
      <div class="info" v-if="active==3">
        商品提交
      </div>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name:"ShopAdd",
    data() {
      return {
        active: 1,
        shopAdd:{},
        BrandData:{},
        TypeData:[],
        TypeDatas:[],
        peopertyAdd:{},
        peoper:{},
        peopertyData:[],
        skuData:[],
        notSkuData:[],
        dan:"",
        xia:"",
        duo:[]
            //[{    name:"",typeNames:[{ type: "L", img: "" }]     }]
      };
    },methods: {
      next() {
        if (this.active++ > 3) this.active = 1;
      },
      pre() {
        if (this.active-- < 2) this.active = 1;
      },
      getTypeData(){
        this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
          //定义的数据     TypeDatas 等于查询出来的所有数据
          this.TypeDatas=rs.data.data;
          //查看有没有子节点数据
          this.getChildrenType();
          for (let i = 0; i <this.TypeData.length ; i++) {
            this.typeName="";
            this.diGui(this.TypeData[i]);
            //给name重新赋值
            this.TypeData[i].name=this.typeName.split("/").reverse().join("/").substr(0,this.typeName.length-1);

          }
        }).catch(err=>{
          console.log("查询类型失败")})
      },
      diGui(node){
        if(node.pid!=0){ //临界值
          this.typeName+="/"+node.name;
          //上级节点
          for (let i = 0; i <this.TypeDatas.length ; i++) {
            if(node.pid==this.TypeDatas[i].id){
              this.diGui(this.TypeDatas[i]);
              break;
            }
          }

        }else{
          this.typeName+="/"+node.name;
        }
      },
      getChildrenType:function(){
        //遍历所有的节点数据
        for (let i = 0; i <this.TypeDatas.length ; i++) {
          //节点中所有数据的一条
          let  node=this.TypeDatas[i];
          //判断有没有子节点
          this.isChildrenNode(node);
        }
      },
      isChildrenNode:function(node){
        let rs=true; //标示
        for (let i = 0; i <this.TypeDatas.length ; i++) {
          //如果数据的id有指向所有数据的pid 证明是下面还有节点的
          if(node.id==this.TypeDatas[i].pid){
            rs=false;
            break;
          }
        }
        if(rs==true){
          //将数据放到表中需要的字段中
          this.TypeData.push(node);
        }
      },
      selectChange(val){
        this.notSkuData=[];
        this.skuData=[];
        this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyByTypeId?typeId="+val).then(rs=>{
         /* console.log(rs.data);*/
          let peopertyData=rs.data;

          //判断分类是否有数据   更新 参数和规格
          if(peopertyData.length>0){
            for (let i = 0; i <peopertyData.length ; i++) {
                      if (peopertyData[i].isSku==0){
                                if(peopertyData[i].peopertyType!=3){
                                  //得到属性类型不为3（输入框）的所有属性值
                                        this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+peopertyData[i].id).then(rs=>{
                                          peopertyData[i].values=rs.data;
                                          this.skuData.push(peopertyData[i]);
                                        }).catch(err=>console.log("查询属性信息失败"))
                                }
                                else{
                                  this.skuData.push(peopertyData[i]);
                                }
                      }
                      else{
                              if(peopertyData[i].peopertyType!=3){
                                 //得到属性类型不为3（输入框）的所有属性值
                                      this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+peopertyData[i].id).then(rs=>{
                                       peopertyData[i].values=rs.data;
                                        this.notSkuData.push(peopertyData[i]);
                                      }).catch(err=>console.log("查询属性信息失败"))
                               }
                              else{
                                  this.notSkuData.push(peopertyData[i]);
                                  console.log(this.notSkuData)
                              }
                      }
            }
          }else{
            this.notSkuData=[];
            this.skuData=[];
          }
        });
        /*console.log(this.skuData);
        console.log(this.notSkuData);*/
      }

    },created(){
            this.$axios.get("http://localhost:8080/api/brand/queryAllBrandData").then(rs=>{
              this.BrandData=rs.data;
            }).catch(err=>{console.log("查询品牌信息失败")});
      this.getTypeData();
    }
  }
</script>
<style>
  .tbody{
    width:80%;
    margin-left:10%;
    margin-top: 2%;

  }
</style>
