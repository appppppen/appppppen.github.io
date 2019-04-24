

var  _twinkleStars
,_starData
,_radius
,_starLimit
,_starScale
,_showAsterisms
,_asterismColor
,_twinkleStars;
    function CelestialSphere(name,scene,starData,radius,starLimit,starScale,showAsterisms,asterismColor,twinkleStars){
        _twinkleStars=!0,
        _starData=starData,
        _radius=radius,
        _starLimit=starLimit,
        _starScale=starScale,
        _showAsterisms=showAsterisms,
        _asterismColor=asterismColor,
        _twinkleStars=twinkleStars;
        var p=new BABYLON.Mesh("starMesh",scene);
        p.alphaIndex=20;
        for(var c=[],B=[],x=[],u=[],g=[],L=0,w=Math.min(_starData.rightAscension.length,_starLimit),O=0;O<w;O++){
            var A=_starData.rightAscension[O],
            N=_starData.declination[O],
            v=starScaleFactor(O),
            _=new BABYLON.Vector3(0*v,.7*v,_radius),
            C=new BABYLON.Vector3(-.5*v,-.3*v,_radius),
            f=new BABYLON.Vector3(.5*v,-.3*v,_radius),
            m=BABYLON.Matrix.RotationYawPitchRoll(-A,-N,0);
            _=BABYLON.Vector3.TransformCoordinates(_,m),
            C=BABYLON.Vector3.TransformCoordinates(C,m),
            f=BABYLON.Vector3.TransformCoordinates(f,m),
            c.push(_.x,_.y,_.z,C.x,C.y,C.z,f.x,f.y,f.z);
            var Y=starColor(O);
            x.push(Y.r,Y.g,Y.b,Y.a,Y.r,Y.g,Y.b,Y.a,Y.r,Y.g,Y.b,Y.a),
            u.push(.5,1,0,0,1,0);

            var b=Math.random(),
            S=Math.random();
            g.push(b,S,b,S,b,S),
            B.push(L,L+1,L+2),L+=3
        }

        var T=new BABYLON.VertexData;
        T.positions=c,
        T.indices=B,
        T.colors=x,
        T.uvs=u,
        T.uvs2=g,
        T.applyToMesh(p);

        var I=new BABYLON.StandardMaterial("starMaterial",scene),
        k=new BABYLON.Texture("static/image/star.png",scene);
        if(I.opacityTexture=k,I.disableLighting=!0,p.material=I,_twinkleStars){
            var M=new BABYLON.Texture("static/image/noise.png",scene);
            I.emissiveTexture=M,
            M.coordinatesIndex=1,
            scene.registerBeforeRender(function(){M.uOffset+=.008})
        }else {
        I.emissiveColor=new BABYLON.Color3(1,1,1);
        }

        if(_showAsterisms){
            for(var G=[],U=0;U<_starData.asterismIndices.length;U++){
                if(-1!=(O=_starData.asterismIndices[U])){
                    A=_starData.rightAscension[O],
                    N=_starData.declination[O];
                    var y=_radius*Math.cos(N)*Math.sin(A),
                    V=_radius*Math.sin(N),
                    D=_radius*Math.cos(N)*Math.cos(A);
                    G.push(new BABYLON.Vector3(-y,V,D))
                }else{
                    var z=BABYLON.Mesh.CreateLines("asterismLines",G,scene);
                    z.color=_asterismColor,
                    z.alphaIndex=10,
                    G=[]
                }
            }
        }
            
        new BABYLON.Color3(1,0,0);
        var R=[];
        for(U=0;U<101;U++){
            var F=2*Math.PI*U/100;
            y=Math.cos(F)*_radius,
            V=0,
            D=Math.sin(F)*_radius;
            R.push(new BABYLON.Vector3(y,V,D))
        }
        radius+=20;
        var P=2*Math.PI*radius/4/2,
        E=[new BABYLON.Vector3(0,0,P),new BABYLON.Vector3(0,0,-P)],
        H= new BABYLON.TransformNode("tubeParentXform"),
        W= new BABYLON.TransformNode("tubeChildXform"),
        j=BABYLON.MeshBuilder.CreateTube("tube",{path:E,radius:radius,sideOrientation:BABYLON.MesBACKSIDE,updatable:!1},scene);
        j.alphaIndex=0;
        var X=new BABYLON.Texture("static/image/eso0932a.png",scene,!0,!1);
        X.vScale=-1,
        j.parent=W,
        W.parent=H,
        j.rotate(new BABYLON.Vector3(0,0,-1),.57),
        W.rotate(new BABYLON.Vector3(1,0,0),.48),
        H.rotate(new BABYLON.Vector3(0,-1,0),.22);
        var J=new BABYLON.StandardMaterial("skyBox",scene);
        return J.backFaceCulling=!0,
            J.disableLighting=!0,
            J.emissiveTexture=X,
            j.material=J,
            j.material.alpha=.5
    }


    function starColor(e){
        var t=BABYLON.Scalar.Normalize(_starData.colorIndexBV[e],-.4,2),
        a=_starData.color.length-1,
        r=Math.round(a*t);
        r=BABYLON.Scalar.Clamp(r,0,a);
        var n=_starData.color[r];
        return new BABYLON.Color4(n[0],n[1],n[2],0)
    }

    function starScaleFactor(e){
        return(8-_starData.apparentMagnitude[e])*_starScale
    }